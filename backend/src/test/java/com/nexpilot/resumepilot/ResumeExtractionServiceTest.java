package com.nexpilot.resumepilot;

import com.nexpilot.resumepilot.exception.InvalidDocumentException;
import com.nexpilot.resumepilot.service.ResumeExtractionService;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.encryption.AccessPermission;
import org.apache.pdfbox.pdmodel.encryption.StandardProtectionPolicy;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.font.Standard14Fonts;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.apache.poi.xwpf.usermodel.XWPFParagraph;
import org.apache.poi.xwpf.usermodel.XWPFRun;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockMultipartFile;

import java.io.ByteArrayOutputStream;
import java.io.IOException;

import static org.junit.jupiter.api.Assertions.*;

public class ResumeExtractionServiceTest {

    private ResumeExtractionService extractionService;

    @BeforeEach
    void setUp() {
        extractionService = new ResumeExtractionService();
    }

    private byte[] createSamplePdfBytes(String content) throws IOException {
        try (PDDocument doc = new PDDocument()) {
            PDPage page = new PDPage();
            doc.addPage(page);
            try (PDPageContentStream cs = new PDPageContentStream(doc, page)) {
                cs.beginText();
                cs.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA), 12);
                cs.newLineAtOffset(50, 700);
                cs.showText(content);
                cs.endText();
            }
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            doc.save(baos);
            return baos.toByteArray();
        }
    }

    private byte[] createSampleDocxBytes(String content) throws IOException {
        try (XWPFDocument doc = new XWPFDocument()) {
            XWPFParagraph p = doc.createParagraph();
            XWPFRun run = p.createRun();
            run.setText(content);
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            doc.write(baos);
            return baos.toByteArray();
        }
    }

    @Test
    void testValidPdfExtraction() throws Exception {
        byte[] pdfBytes = createSamplePdfBytes("John Doe - Senior Java Engineer with Spring Boot and PostgreSQL experience.");
        MockMultipartFile file = new MockMultipartFile(
            "file",
            "resume.pdf",
            "application/pdf",
            pdfBytes
        );

        ResumeExtractionService.ExtractedResume result = extractionService.extractText(file);
        assertNotNull(result);
        assertEquals("pdf", result.fileType());
        assertTrue(result.text().contains("Senior Java Engineer"));
        assertTrue(result.text().contains("Spring Boot"));
        assertEquals("resume.pdf", result.originalFilename());
    }

    @Test
    void testValidDocxExtraction() throws Exception {
        byte[] docxBytes = createSampleDocxBytes("Jane Smith - Full-Stack Developer specializing in React, TypeScript, and Node.js.");
        MockMultipartFile file = new MockMultipartFile(
            "file",
            "candidate_cv.docx",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            docxBytes
        );

        ResumeExtractionService.ExtractedResume result = extractionService.extractText(file);
        assertNotNull(result);
        assertEquals("docx", result.fileType());
        assertTrue(result.text().contains("Full-Stack Developer"));
        assertTrue(result.text().contains("TypeScript"));
    }

    @Test
    void testEmptyFileRejection() {
        MockMultipartFile emptyFile = new MockMultipartFile(
            "file",
            "empty.pdf",
            "application/pdf",
            new byte[0]
        );

        InvalidDocumentException ex = assertThrows(
            InvalidDocumentException.class,
            () -> extractionService.extractText(emptyFile)
        );
        assertEquals("EMPTY_FILE", ex.getCode());
    }

    @Test
    void testUnsupportedFileExtensionRejection() {
        byte[] textBytes = "This is a plain text file without proper document headers.".getBytes();
        MockMultipartFile file = new MockMultipartFile(
            "file",
            "document.txt",
            "text/plain",
            textBytes
        );

        InvalidDocumentException ex = assertThrows(
            InvalidDocumentException.class,
            () -> extractionService.extractText(file)
        );
        assertEquals("UNSUPPORTED_TYPE", ex.getCode());
    }

    @Test
    void testFakeSignatureMismatchRejection() {
        // A file named resume.pdf that actually contains random bytes instead of %PDF-
        byte[] fakeBytes = new byte[]{0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08};
        MockMultipartFile file = new MockMultipartFile(
            "file",
            "malicious.pdf",
            "application/pdf",
            fakeBytes
        );

        InvalidDocumentException ex = assertThrows(
            InvalidDocumentException.class,
            () -> extractionService.extractText(file)
        );
        assertEquals("SIGNATURE_MISMATCH", ex.getCode());
    }

    @Test
    void testEncryptedPdfRejection() throws Exception {
        try (PDDocument doc = new PDDocument()) {
            PDPage page = new PDPage();
            doc.addPage(page);

            AccessPermission ap = new AccessPermission();
            StandardProtectionPolicy spp = new StandardProtectionPolicy("ownerSecret", "userSecret", ap);
            doc.protect(spp);

            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            doc.save(baos);
            byte[] encryptedBytes = baos.toByteArray();

            MockMultipartFile file = new MockMultipartFile(
                "file",
                "locked.pdf",
                "application/pdf",
                encryptedBytes
            );

            InvalidDocumentException ex = assertThrows(
                InvalidDocumentException.class,
                () -> extractionService.extractText(file)
            );
            assertEquals("ENCRYPTED_PDF", ex.getCode());
        }
    }

    @Test
    void testEmptyTextPdfRejection() throws Exception {
        // PDF with no text inside
        try (PDDocument doc = new PDDocument()) {
            PDPage page = new PDPage();
            doc.addPage(page); // empty page
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            doc.save(baos);
            byte[] emptyPdf = baos.toByteArray();

            MockMultipartFile file = new MockMultipartFile(
                "file",
                "blank.pdf",
                "application/pdf",
                emptyPdf
            );

            InvalidDocumentException ex = assertThrows(
                InvalidDocumentException.class,
                () -> extractionService.extractText(file)
            );
            assertEquals("NO_READABLE_TEXT", ex.getCode());
        }
    }
}

