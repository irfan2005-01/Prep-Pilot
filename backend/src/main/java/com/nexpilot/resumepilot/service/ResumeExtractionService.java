package com.nexpilot.resumepilot.service;

import com.nexpilot.resumepilot.exception.InvalidDocumentException;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.io.RandomAccessReadBuffer;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.apache.poi.xwpf.usermodel.XWPFParagraph;
import org.apache.poi.xwpf.usermodel.XWPFTable;
import org.apache.poi.xwpf.usermodel.XWPFTableCell;
import org.apache.poi.xwpf.usermodel.XWPFTableRow;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Arrays;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

@Service
public class ResumeExtractionService {

    private static final Logger log = LoggerFactory.getLogger(ResumeExtractionService.class);

    private static final long MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
    private static final int MIN_TEXT_LENGTH = 30; // Minimum meaningful characters

    // Magic numbers
    private static final byte[] PDF_MAGIC = new byte[]{0x25, 0x50, 0x44, 0x46, 0x2D}; // %PDF-
    private static final byte[] ZIP_MAGIC = new byte[]{0x50, 0x4B, 0x03, 0x04};       // PK\x03\x04

    @Value("${resume.max-pages:10}")
    private int maxPages = 10;

    @Value("${resume.max-characters:50000}")
    private int maxCharacters = 50000;

    public record ExtractedResume(
        String text,
        String originalFilename,
        String fileType,
        int characterCount,
        int estimatedWordCount
    ) {}

    public ExtractedResume extractText(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new InvalidDocumentException("No file was uploaded or file is empty.", "EMPTY_FILE");
        }

        if (file.getSize() > MAX_FILE_SIZE_BYTES) {
            throw new InvalidDocumentException(
                "File size (" + (file.getSize() / 1024) + " KB) exceeds maximum allowed size of 5 MB.",
                "FILE_TOO_LARGE"
            );
        }

        String filename = file.getOriginalFilename();
        if (filename == null || filename.isBlank()) {
            filename = "resume";
        }
        String cleanFilename = sanitizeFilename(filename);

        byte[] fileBytes;
        try {
            fileBytes = file.getBytes();
        } catch (IOException e) {
            throw new InvalidDocumentException("Could not read uploaded file content.", "READ_ERROR", e);
        }

        // Determine real file type by magic bytes
        String fileType = detectFileType(fileBytes, cleanFilename);

        String extractedText;
        if ("pdf".equalsIgnoreCase(fileType)) {
            extractedText = extractFromPdf(fileBytes, cleanFilename);
        } else if ("docx".equalsIgnoreCase(fileType)) {
            extractedText = extractFromDocx(fileBytes, cleanFilename);
        } else {
            throw new InvalidDocumentException(
                "Unsupported file type. Only PDF (.pdf) and Microsoft Word (.docx) documents are supported.",
                "UNSUPPORTED_TYPE"
            );
        }

        // Validate extracted text
        String normalizedText = normalizeText(extractedText);
        if (normalizedText.length() < MIN_TEXT_LENGTH || !containsAlphanumericContent(normalizedText)) {
            throw new InvalidDocumentException(
                "No readable text could be extracted from this document. The file may be a scanned image or blank. " +
                "Prep Pilot requires text-based PDF or DOCX documents (scanned image OCR is not supported in this phase).",
                "NO_READABLE_TEXT"
            );
        }

        // Enforce maximum character safety limit
        if (normalizedText.length() > maxCharacters) {
            normalizedText = normalizedText.substring(0, maxCharacters);
            log.info("Resume text truncated to safety limit of {} characters", maxCharacters);
        }

        int wordCount = countWords(normalizedText);

        log.info("Successfully extracted text from document type: {}, words: {}", fileType, wordCount);

        return new ExtractedResume(
            normalizedText,
            cleanFilename,
            fileType,
            normalizedText.length(),
            wordCount
        );
    }

    private String detectFileType(byte[] bytes, String filename) {
        if (bytes.length < 4) {
            throw new InvalidDocumentException("File is corrupted or too small to be a valid document.", "CORRUPT_FILE");
        }

        // Check PDF magic signature
        if (startsWithBytes(bytes, PDF_MAGIC)) {
            return "pdf";
        }

        // Check ZIP magic signature (used by DOCX)
        if (startsWithBytes(bytes, ZIP_MAGIC)) {
            if (isDocxZipStructure(bytes)) {
                return "docx";
            } else {
                throw new InvalidDocumentException(
                    "Uploaded file is a zip archive but does not contain a valid Microsoft Word (.docx) structure.",
                    "INVALID_DOCX_STRUCTURE"
                );
            }
        }

        // If magic bytes do not match, check extension to give helpful error
        String lowerFilename = filename.toLowerCase();
        if (lowerFilename.endsWith(".pdf") || lowerFilename.endsWith(".docx")) {
            throw new InvalidDocumentException(
                "The file signature does not match its file extension. Please upload a genuine, uncorrupted PDF or DOCX file.",
                "SIGNATURE_MISMATCH"
            );
        }

        throw new InvalidDocumentException(
            "Unsupported file format. Please upload a PDF (.pdf) or Word (.docx) document.",
            "UNSUPPORTED_TYPE"
        );
    }

    private boolean isDocxZipStructure(byte[] bytes) {
        try (ZipInputStream zis = new ZipInputStream(new ByteArrayInputStream(bytes))) {
            ZipEntry entry;
            boolean hasWordEntry = false;
            boolean hasContentTypes = false;
            while ((entry = zis.getNextEntry()) != null) {
                String name = entry.getName();
                if (name.startsWith("word/") || name.equals("word/document.xml")) {
                    hasWordEntry = true;
                }
                if (name.equals("[Content_Types].xml")) {
                    hasContentTypes = true;
                }
                if (hasWordEntry && hasContentTypes) {
                    return true;
                }
            }
            return hasWordEntry;
        } catch (Exception e) {
            return false;
        }
    }

    private String extractFromPdf(byte[] bytes, String filename) {
        try (PDDocument document = Loader.loadPDF(new RandomAccessReadBuffer(bytes))) {
            if (document.isEncrypted()) {
                throw new InvalidDocumentException(
                    "The uploaded PDF is password protected or encrypted. Please upload an unprotected resume.",
                    "ENCRYPTED_PDF"
                );
            }

            int pageCount = document.getNumberOfPages();
            if (pageCount > maxPages) {
                throw new InvalidDocumentException(
                    "The PDF exceeds the maximum allowed page count of " + maxPages + " pages (found " + pageCount + " pages).",
                    "PAGE_LIMIT_EXCEEDED"
                );
            }

            PDFTextStripper stripper = new PDFTextStripper();
            stripper.setSortByPosition(true);
            return stripper.getText(document);
        } catch (InvalidDocumentException ide) {
            throw ide;
        } catch (org.apache.pdfbox.pdmodel.encryption.InvalidPasswordException e) {
            throw new InvalidDocumentException(
                "The uploaded PDF is password protected or encrypted. Please upload an unprotected resume.",
                "ENCRYPTED_PDF",
                e
            );
        } catch (Exception e) {
            if (e.getMessage() != null && (e.getMessage().toLowerCase().contains("decrypt") || e.getMessage().toLowerCase().contains("password"))) {
                throw new InvalidDocumentException(
                    "The uploaded PDF is password protected or encrypted. Please upload an unprotected resume.",
                    "ENCRYPTED_PDF",
                    e
                );
            }
            log.warn("Failed to parse PDF document: {}", e.getMessage());
            throw new InvalidDocumentException(
                "Unable to read PDF document. The file may be corrupted or damaged.",
                "PDF_PARSE_ERROR",
                e
            );
        }
    }

    private String extractFromDocx(byte[] bytes, String filename) {
        try (InputStream is = new ByteArrayInputStream(bytes);
             XWPFDocument document = new XWPFDocument(is)) {

            StringBuilder sb = new StringBuilder();

            // Extract paragraphs
            for (XWPFParagraph paragraph : document.getParagraphs()) {
                String text = paragraph.getText();
                if (text != null && !text.isBlank()) {
                    sb.append(text.trim()).append("\n");
                }
            }

            // Extract tables
            for (XWPFTable table : document.getTables()) {
                for (XWPFTableRow row : table.getRows()) {
                    for (XWPFTableCell cell : row.getTableCells()) {
                        String text = cell.getText();
                        if (text != null && !text.isBlank()) {
                            sb.append(text.trim()).append(" | ");
                        }
                    }
                    sb.append("\n");
                }
            }

            return sb.toString();
        } catch (Exception e) {
            log.warn("Failed to parse DOCX document: {}", e.getMessage());
            throw new InvalidDocumentException(
                "Unable to read Word document. The file may be corrupted or in an unsupported format.",
                "DOCX_PARSE_ERROR",
                e
            );
        }
    }

    private boolean startsWithBytes(byte[] source, byte[] target) {
        if (source.length < target.length) return false;
        for (int i = 0; i < target.length; i++) {
            if (source[i] != target[i]) return false;
        }
        return true;
    }

    private String normalizeText(String raw) {
        if (raw == null) return "";
        return raw
            .replace("\r\n", "\n")
            .replace("\r", "\n")
            .replaceAll("[ \\t]+", " ")
            .replaceAll("\\n{3,}", "\n\n")
            .trim();
    }

    private boolean containsAlphanumericContent(String text) {
        int count = 0;
        for (char c : text.toCharArray()) {
            if (Character.isLetterOrDigit(c)) {
                count++;
                if (count >= 15) return true;
            }
        }
        return false;
    }

    private int countWords(String text) {
        if (text == null || text.isBlank()) return 0;
        String[] words = text.split("\\s+");
        return words.length;
    }

    private String sanitizeFilename(String filename) {
        // Strip path traversal sequences and non-safe characters
        String clean = filename.replace("\\", "/");
        int lastSlash = clean.lastIndexOf('/');
        if (lastSlash >= 0) {
            clean = clean.substring(lastSlash + 1);
        }
        return clean.replaceAll("[^a-zA-Z0-9._-]", "_");
    }
}
