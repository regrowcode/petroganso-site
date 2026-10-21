/**
 * PETROGANSO - COMMERCIAL SUPPLY RFQ SCRIPT
 * Request for Quotation & Cargo Estimator (Bilingual Support)
 */

document.addEventListener('DOMContentLoaded', () => {
  const rfqForm = document.getElementById('rfqForm');
  const commoditySelect = document.getElementById('rfqCommodity');
  const volumeInput = document.getElementById('rfqVolume');
  const unitSelect = document.getElementById('rfqUnit');
  const calcCargoMt = document.getElementById('calcCargoMt');
  const calcEstBbl = document.getElementById('calcEstBbl');
  const calcVesselClass = document.getElementById('calcVesselClass');
  const rfqStatusMsg = document.getElementById('rfqStatusMsg');

  // Approximate industry density factors (bbl per metric tonne)
  const conversionFactors = {
    'crude-light': 7.55,    // Light Sweet Crude
    'crude-heavy': 6.65,    // Heavy Sour Crude
    'diesel-ulsd': 7.45,    // ULSD 10ppm
    'jet-a1': 7.90,         // Jet A-1 Fuel
    'fuel-vlsfo': 6.70,     // VLSFO 0.5% Marine
    'marine-mgo': 7.50,     // Marine Gas Oil 0.1%
    'gasoline-95': 8.50,    // Mogas 95 Ron
    'naphtha': 8.90         // Naphtha Full Range
  };

  function getLang() {
    return window.getSiteLanguage ? window.getSiteLanguage() : 'es';
  }

  function updateEstimator() {
    if (!volumeInput || !unitSelect || !commoditySelect) return;

    const volume = parseFloat(volumeInput.value) || 0;
    const unit = unitSelect.value;
    const commodity = commoditySelect.value || 'crude-light';
    const factor = conversionFactors[commodity] || 7.33;
    const lang = getLang();

    let bbl = 0;
    let mt = 0;

    if (unit === 'bbl') {
      bbl = volume;
      mt = bbl / factor;
    } else {
      mt = volume;
      bbl = mt * factor;
    }

    if (calcCargoMt) {
      calcCargoMt.textContent = mt > 0 ? `${Math.round(mt).toLocaleString()} MT` : '-- MT';
    }

    if (calcEstBbl) {
      calcEstBbl.textContent = bbl > 0 ? `${Math.round(bbl).toLocaleString()} BBL` : '-- BBL';
    }

    // Determine typical shipping vessel sizing
    if (calcVesselClass) {
      if (bbl <= 0) {
        calcVesselClass.textContent = lang === 'en' ? 'Pending' : 'Pendiente';
      } else if (bbl < 100000) {
        calcVesselClass.textContent = lang === 'en' ? 'Coastal Barge / Feeder' : 'Barcaza Costera / Feeder';
      } else if (bbl < 350000) {
        calcVesselClass.textContent = 'MR / Handymax (35k-50k DWT)';
      } else if (bbl < 650000) {
        calcVesselClass.textContent = 'Panamax (55k-75k DWT)';
      } else if (bbl < 1100000) {
        calcVesselClass.textContent = 'Aframax (80k-120k DWT)';
      } else if (bbl < 1700000) {
        calcVesselClass.textContent = 'Suezmax (120k-160k DWT)';
      } else {
        calcVesselClass.textContent = 'VLCC (200k-300k DWT)';
      }
    }
  }

  // Event Listeners for Realtime updates
  if (volumeInput) volumeInput.addEventListener('input', updateEstimator);
  if (unitSelect) unitSelect.addEventListener('change', updateEstimator);
  if (commoditySelect) commoditySelect.addEventListener('change', updateEstimator);
  window.addEventListener('petrogansoLangChange', updateEstimator);

  // Form Submission
  if (rfqForm) {
    rfqForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const btnSubmit = rfqForm.querySelector('button[type="submit"]');
      const originalText = btnSubmit ? btnSubmit.innerHTML : 'Enviar';
      const lang = getLang();

      if (btnSubmit) {
        btnSubmit.disabled = true;
        btnSubmit.innerHTML = `
          <svg style="animation: spin 1s linear infinite; width:16px; height:16px;" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" opacity="0.25"></circle>
            <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg> ${lang === 'en' ? 'Registering with Commercial Dept...' : 'Registrando con Dpto. Comercial...'}
        `;
      }

      setTimeout(() => {
        const trackingNum = `PG-RFQ-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

        if (rfqStatusMsg) {
          rfqStatusMsg.className = 'form-status-msg success';
          if (lang === 'en') {
            rfqStatusMsg.innerHTML = `
              <strong>✓ Supply Quotation Request Received Successfully</strong><br>
              Reference Tracking Number: <strong>${trackingNum}</strong>.<br>
              Our commercial team in Panama City has recorded your product requirements and Incoterm. An assigned representative will review the specifications and issue a formal Soft Corporate Offer (SCO).
            `;
          } else {
            rfqStatusMsg.innerHTML = `
              <strong>✓ Solicitud de Cotización Recibida Exitosamente</strong><br>
              Número de Referencia Comercial: <strong>${trackingNum}</strong>.<br>
              Nuestro departamento comercial en Ciudad de Panamá ha registrado los requerimientos de producto e Incoterm. Un asesor asignado evaluará las especificaciones para emitir la oferta formal (SCO).
            `;
          }
          rfqStatusMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        rfqForm.reset();
        updateEstimator();

        if (btnSubmit) {
          btnSubmit.disabled = false;
          btnSubmit.innerHTML = originalText;
        }
      }, 1000);
    });
  }

  // Run initial calculation
  updateEstimator();
});
