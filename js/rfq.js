/**
 * PETROGANSO - TRADING DESK RFQ SCRIPT
 * Request for Quotation & Cargo Estimator
 */

document.addEventListener('DOMContentLoaded', () => {
  const rfqForm = document.getElementById('rfqForm');
  const commoditySelect = document.getElementById('rfqCommodity');
  const volumeInput = document.getElementById('rfqVolume');
  const unitSelect = document.getElementById('rfqUnit');
  const incotermSelect = document.getElementById('rfqIncoterm');
  const calcCargoMt = document.getElementById('calcCargoMt');
  const calcEstBbl = document.getElementById('calcEstBbl');
  const calcVesselClass = document.getElementById('calcVesselClass');
  const rfqStatusMsg = document.getElementById('rfqStatusMsg');

  // Conversion density approximate ratios (bbl per metric tonne)
  const conversionFactors = {
    'crude-light': 7.55,    // Light Sweet Crude (38-42 API)
    'crude-heavy': 6.65,    // Heavy Sour Crude (20-24 API)
    'diesel-ulsd': 7.45,    // ULSD 10ppm
    'jet-a1': 7.90,         // Jet A-1 Fuel
    'fuel-vlsfo': 6.70,     // VLSFO 0.5% S Marine
    'marine-mgo': 7.50,     // Marine Gas Oil 0.1%
    'gasoline-95': 8.50,    // Mogas 95 Ron
    'naphtha': 8.90         // Naphtha Full Range
  };

  function updateEstimator() {
    if (!volumeInput || !unitSelect || !commoditySelect) return;

    const volume = parseFloat(volumeInput.value) || 0;
    const unit = unitSelect.value;
    const commodity = commoditySelect.value || 'crude-light';
    const factor = conversionFactors[commodity] || 7.33;

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
        calcVesselClass.textContent = 'Pendiente';
      } else if (bbl < 100000) {
        calcVesselClass.textContent = 'Barge / Coastal Carrier';
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

  // Form Submission
  if (rfqForm) {
    rfqForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const btnSubmit = rfqForm.querySelector('button[type="submit"]');
      const originalText = btnSubmit ? btnSubmit.innerHTML : 'Enviar';

      if (btnSubmit) {
        btnSubmit.disabled = true;
        btnSubmit.innerHTML = `
          <svg style="animation: spin 1s linear infinite; width:18px; height:18px;" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" opacity="0.25"></circle>
            <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg> Registrando en Mesa de Trading...
        `;
      }

      setTimeout(() => {
        const trackingNum = `PG-RFQ-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

        if (rfqStatusMsg) {
          rfqStatusMsg.className = 'form-status-msg success';
          rfqStatusMsg.innerHTML = `
            <strong>✓ Solicitud de Cotización Recibida Exitosamente</strong><br>
            Número de Referencia de Trading: <strong>${trackingNum}</strong>.<br>
            Nuestra mesa comercial en Ciudad de Panamá ha registrado los requerimientos de volumen e Incoterm. Un trader asignado revisará la especificación y le remitirá la oferta formal (SCO / Soft Corporate Offer).
          `;
          rfqStatusMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        rfqForm.reset();
        updateEstimator();

        if (btnSubmit) {
          btnSubmit.disabled = false;
          btnSubmit.innerHTML = originalText;
        }
      }, 1200);
    });
  }

  // Run initial calculation
  updateEstimator();
});
