import { useState } from 'react'

function App() {
  const [view, setView] = useState('menu'); // 'menu', 'biga', 'aluat'

  // Biga states
  const [bigaAer, setBigaAer] = useState('');
  const [bigaFaina, setBigaFaina] = useState('');
  const [bigaResult, setBigaResult] = useState('');
  const [bigaError, setBigaError] = useState(false);

  // Aluat states
  const [aluatBiga, setAluatBiga] = useState('');
  const [aluatFaina, setAluatFaina] = useState('');
  const [aluatAer, setAluatAer] = useState('');
  const [aluatResult, setAluatResult] = useState('');
  const [aluatError, setAluatError] = useState(false);

  const validateNumber = (val) => {
      return !isNaN(val) && val !== '';
  };

  const sendLogToDiscord = async (type, inputs, result) => {
    const webhookUrl = 'https://discord.com/api/webhooks/1496788121847730196/Kayu7YaEqzGdb58D-6HLNlq2NEJbnSn76ZtzVTO3McNPzhpzeUyy-RD1yHvjFfGIW2f4';
    const now = new Date();
    const dateStr = now.toLocaleDateString('ro-RO');
    const timeStr = now.toLocaleTimeString('ro-RO');

    const fields = Object.entries(inputs).map(([key, value]) => ({
        name: key,
        value: `${value}°C`,
        inline: true
    }));

    const embed = {
        title: `Calcul Nou: ${type}`,
        color: type === 'Biga' ? 0x8B4513 : 0xD2691E, // Rustic colors
        fields: [
            ...fields,
            { name: 'Rezultat (Apa)', value: `**${result}°C**`, inline: false },
            { name: 'Data', value: dateStr, inline: true },
            { name: 'Ora', value: timeStr, inline: true }
        ],
        footer: { text: 'Calculator Aluat' },
        timestamp: now.toISOString()
    };

    try {
        await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ embeds: [embed] })
        });
    } catch (error) {
        console.error('Discord Log Error:', error);
    }
  };

  const handleCalcBiga = () => {
    if (!validateNumber(bigaAer) || !validateNumber(bigaFaina)) {
        setBigaError(true);
        setBigaResult('');
        return;
    }
    setBigaError(false);
    const numAer = parseFloat(bigaAer);
    const numFaina = parseFloat(bigaFaina);
    const rezultat = numAer + numFaina;
    const tempApa = (54 - rezultat).toFixed(1);
    setBigaResult(tempApa);
    sendLogToDiscord('Biga', { 'Temperatură Aer': bigaAer, 'Temperatură Făină': bigaFaina }, tempApa);
  };

  const handleCalcAluat = () => {
    if (!validateNumber(aluatBiga) || !validateNumber(aluatFaina) || !validateNumber(aluatAer)) {
        setAluatError(true);
        setAluatResult('');
        return;
    }
    setAluatError(false);
    const numBiga = parseFloat(aluatBiga);
    const numFaina = parseFloat(aluatFaina);
    const numAer = parseFloat(aluatAer);
    const r = (numBiga + numFaina) / 2;
    const x = r + numAer;
    const tempApa = (54 - x).toFixed(1);
    setAluatResult(tempApa);
    sendLogToDiscord('Aluat', { 'Temperatură Biga': aluatBiga, 'Temperatură Făină': aluatFaina, 'Temperatură Aer': aluatAer }, tempApa);
  };

  const resetAll = () => {
      setBigaAer('');
      setBigaFaina('');
      setBigaResult('');
      setBigaError(false);
      setAluatBiga('');
      setAluatFaina('');
      setAluatAer('');
      setAluatResult('');
      setAluatError(false);
      setView('menu');
  };

  return (
    <div className="app-wrapper">
      <div className="container">
        {view === 'menu' && (
          <div className="menu-view">
              <h1>Alege <span>Tipul</span></h1>
              <button onClick={() => setView('biga')}>Calcul Biga</button>
              <button onClick={() => setView('aluat')}>Calcul Aluat</button>
          </div>
        )}

        {view === 'biga' && (
          <div className="calc-view">
              <h1>Calcul <span>Biga</span></h1>
              <div className="input-group">
                  <label htmlFor="b-aer">Temperatură aer (°C)</label>
                  <input type="number" id="b-aer" step="0.1" placeholder="ex. 24.5" value={bigaAer} onChange={(e) => setBigaAer(e.target.value)} />
              </div>
              <div className="input-group">
                  <label htmlFor="b-faina">Temperatură făină (°C)</label>
                  <input type="number" id="b-faina" step="0.1" placeholder="ex. 20" value={bigaFaina} onChange={(e) => setBigaFaina(e.target.value)} />
              </div>
              {bigaError && <div className="error">Introduceți toate valorile corect.</div>}
              <button onClick={handleCalcBiga}>Calculează</button>
              {bigaResult && (
                  <div className="result-box">
                      Temperatura apei
                      <span>{bigaResult}°C</span>
                  </div>
              )}
              <button className="btn-back" onClick={resetAll}>Înapoi</button>
          </div>
        )}

        {view === 'aluat' && (
          <div className="calc-view">
              <h1>Calcul <span>Aluat</span></h1>
              <div className="input-group">
                  <label htmlFor="a-biga">Temperatură biga (°C)</label>
                  <input type="number" id="a-biga" step="0.1" placeholder="ex. 18" value={aluatBiga} onChange={(e) => setAluatBiga(e.target.value)} />
              </div>
              <div className="input-group">
                  <label htmlFor="a-faina">Temperatură făină (°C)</label>
                  <input type="number" id="a-faina" step="0.1" placeholder="ex. 20" value={aluatFaina} onChange={(e) => setAluatFaina(e.target.value)} />
              </div>
              <div className="input-group">
                  <label htmlFor="a-aer">Temperatură aer (°C)</label>
                  <input type="number" id="a-aer" step="0.1" placeholder="ex. 24.5" value={aluatAer} onChange={(e) => setAluatAer(e.target.value)} />
              </div>
              {aluatError && <div className="error">Introduceți toate valorile corect.</div>}
              <button onClick={handleCalcAluat}>Calculează</button>
              {aluatResult && (
                  <div className="result-box">
                      Temperatura apei
                      <span>{aluatResult}°C</span>
                  </div>
              )}
              <button className="btn-back" onClick={resetAll}>Înapoi</button>
          </div>
        )}
      </div>

      <a href="https://corneluu.github.io/corneluu/" target="_blank" rel="noopener noreferrer" className="signature">
        <div className="dot"></div>
        Creat de Cornel
      </a>
    </div>
  )
}

export default App
