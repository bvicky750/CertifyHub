import React, { useRef } from 'react';
import { X, Download, ExternalLink, Printer, Award, ShieldCheck, CheckCircle2 } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const CertificateModal = ({ certificate, isOpen, onClose }) => {
  const certificateRef = useRef(null);

  if (!isOpen || !certificate) return null;

  const formattedDate = new Date(certificate.issue_date || Date.now()).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const handleDownloadPdf = async () => {
    if (!certificateRef.current) return;

    try {
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });

      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      const safeTitle = (certificate.course_title || 'Course').replace(/[^a-zA-Z0-9]/g, '_');
      pdf.save(`Certificate-${safeTitle}.pdf`);
    } catch (err) {
      console.error('PDF generation error:', err);
      // Fallback to backend PDF endpoint
      window.open(`http://localhost:5000/api/certificates/${certificate.id || certificate.certificate_number}/pdf`, '_blank');
    }
  };

  const verifyUrl = `${window.location.origin}/verify?id=${encodeURIComponent(certificate.certificate_number || '')}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden my-8">
        
        {/* Modal Top Control Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <Award className="w-5 h-5 text-amber-400" />
            <span className="font-semibold text-sm">Official Academic Credential</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleDownloadPdf}
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold bg-brand-600 hover:bg-brand-500 rounded-lg transition text-white shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>
            <button
              onClick={() => window.print()}
              className="hidden sm:flex items-center space-x-1 px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 rounded-lg transition text-slate-200"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Display Canvas */}
        <div className="p-4 sm:p-8 bg-slate-100 flex justify-center">
          <div
            id="certificate-print-area"
            ref={certificateRef}
            className="w-full max-w-3xl aspect-[1.414/1] bg-gradient-to-br from-white via-slate-50 to-white text-slate-900 p-8 sm:p-12 relative border-[10px] border-double border-slate-800 shadow-2xl rounded-sm flex flex-col justify-between"
          >
            {/* Elegant Inner Border */}
            <div className="absolute inset-2 border border-amber-600/40 pointer-events-none"></div>

            {/* Corner Filigrees */}
            <div className="absolute top-4 left-4 text-xs tracking-widest text-amber-600/70 uppercase font-mono">✦ CERTIFYHUB ✦</div>
            <div className="absolute top-4 right-4 text-xs tracking-widest text-amber-600/70 uppercase font-mono">✦ ACCREDITED ✦</div>

            {/* Certificate Header */}
            <div className="text-center pt-2">
              <div className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">
                <span>CERTIFYHUB ONLINE ACADEMY</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-serif font-bold text-slate-900 tracking-wider">
                CERTIFICATE OF COMPLETION
              </h1>
              <div className="w-24 h-1 bg-gradient-to-r from-brand-600 via-amber-500 to-accent-600 mx-auto mt-2 rounded-full"></div>
            </div>

            {/* Certificate Body */}
            <div className="text-center my-auto py-4">
              <p className="text-xs sm:text-sm text-slate-500 font-serif italic">
                This certificate is proudly presented to
              </p>
              <h2 className="text-xl sm:text-3xl font-serif font-bold text-brand-900 mt-2 mb-1 tracking-wide underline decoration-amber-500/50 decoration-2 underline-offset-8">
                {certificate.student_name || 'Academic Scholar'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto mt-4 leading-relaxed font-serif">
                for demonstrating exceptional competence and successfully fulfilling all curriculum requirements, hands-on modules, and the comprehensive final evaluation for
              </p>
              <h3 className="text-base sm:text-2xl font-bold text-slate-900 mt-2 font-sans tracking-tight">
                {certificate.course_title || 'Course of Study'}
              </h3>
            </div>

            {/* Certificate Footer */}
            <div className="pt-4 border-t border-slate-200 grid grid-cols-3 items-end text-xs">
              
              {/* Left Column: Dates & IDs */}
              <div className="space-y-1 text-slate-600 font-mono text-[10px] sm:text-xs">
                <p>Issued: <span className="font-semibold text-slate-800">{formattedDate}</span></p>
                <p>ID: <span className="font-semibold text-slate-800">{certificate.certificate_number}</span></p>
                <p>Code: <span className="font-semibold text-slate-800">{certificate.verification_code}</span></p>
              </div>

              {/* Center: Gold Medallion Seal */}
              <div className="flex flex-col items-center justify-center">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-amber-500 via-amber-400 to-amber-300 border-2 border-amber-600 shadow-md flex items-center justify-center text-slate-900 relative group">
                  <div className="absolute inset-1 rounded-full border border-dashed border-amber-800/40"></div>
                  <ShieldCheck className="w-7 h-7 sm:w-8 sm:h-8 text-slate-900" />
                </div>
                <span className="text-[9px] font-bold tracking-widest text-amber-800 uppercase mt-1">VERIFIED SEAL</span>
              </div>

              {/* Right Column: Signature */}
              <div className="text-right space-y-1">
                <div className="w-28 sm:w-36 border-b border-slate-800 ml-auto mb-1">
                  <span className="font-serif italic text-xs text-slate-700">{certificate.instructor_name || 'Academic Dean'}</span>
                </div>
                <p className="text-[10px] sm:text-xs font-semibold text-slate-800">Course Instructor</p>
                <p className="text-[9px] text-slate-500">CertifyHub Academic Board</p>
              </div>

            </div>

          </div>
        </div>

        {/* Modal Bottom Bar */}
        <div className="px-6 py-4 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2 text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span className="font-medium">Digitally Signed & Database Verified</span>
          </div>

          <a
            href={verifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-1 text-brand-600 hover:text-brand-700 font-semibold"
          >
            <span>Open Public Verification Page</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

      </div>
    </div>
  );
};

export default CertificateModal;
