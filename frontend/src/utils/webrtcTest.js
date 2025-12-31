/**
 * WebRTC Testing Utilities
 * Test ob TURN-Server ordnungsgemäß funktioniert
 */

/**
 * Test TURN Server connectivity
 * @returns {Promise<Object>} Object with relay and srflx detection status
 */
export async function testTurnServer() {
  // Get ICE servers configuration
  const turnUsername = import.meta.env.VITE_TURN_USERNAME;
  const turnCredential = import.meta.env.VITE_TURN_CREDENTIAL;
  
  const iceServers = [
    { urls: 'stun:stun.l.google.com:19302' }
  ];
  
  if (turnUsername && turnCredential) {
    iceServers.push(
      {
        urls: 'turn:a.relay.metered.ca:80',
        username: turnUsername,
        credential: turnCredential
      },
      {
        urls: 'turn:a.relay.metered.ca:443',
        username: turnUsername,
        credential: turnCredential
      }
    );
  }
  
  const pc = new RTCPeerConnection({ iceServers });
  
  // Create a data channel to trigger ICE gathering
  pc.createDataChannel('test');
  
  // Create offer to start ICE gathering
  const offer = await pc.createOffer();
  await pc.setLocalDescription(offer);
  
  return new Promise((resolve) => {
    const turnDetected = {
      relay: false,     // TURN relay candidate
      srflx: false,     // STUN server reflexive candidate
      host: false,      // Host candidate
      candidates: []    // All detected candidates
    };
    
    // Timeout after 5 seconds
    const timeout = setTimeout(() => {
      pc.close();
      resolve(turnDetected);
    }, 5000);
    
    pc.onicecandidate = (e) => {
      if (e.candidate) {
        const candidate = e.candidate;
        
        // Store candidate info
        turnDetected.candidates.push({
          type: candidate.type,
          protocol: candidate.protocol,
          address: candidate.address,
          port: candidate.port
        });
        
        // Check candidate types
        if (candidate.type === 'relay') {
          turnDetected.relay = true;
        }
        if (candidate.type === 'srflx') {
          turnDetected.srflx = true;
        }
        if (candidate.type === 'host') {
          turnDetected.host = true;
        }
      } else {
        // ICE gathering complete
        clearTimeout(timeout);
        pc.close();
        resolve(turnDetected);
      }
    };
    
    pc.onicegatheringstatechange = () => {
      console.log('ICE gathering state:', pc.iceGatheringState);
    };
  });
}

/**
 * Run comprehensive WebRTC test and return report
 * @returns {Promise<Object>} Test report with results and recommendations
 */
export async function runWebRTCDiagnostics() {
  const report = {
    timestamp: new Date().toISOString(),
    browserSupport: {
      webrtc: !!window.RTCPeerConnection,
      getUserMedia: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia),
      dataChannels: true
    },
    turnTest: null,
    recommendations: []
  };
  
  // Test TURN server
  try {
    report.turnTest = await testTurnServer();
    
    // Add recommendations based on results
    if (!report.turnTest.relay) {
      report.recommendations.push({
        level: 'warning',
        message: 'TURN server nicht erreichbar. WebRTC funktioniert möglicherweise nicht hinter symmetrischem NAT.'
      });
    }
    
    if (!report.turnTest.srflx) {
      report.recommendations.push({
        level: 'warning',
        message: 'STUN server nicht erreichbar. Kann keine öffentliche IP ermitteln.'
      });
    }
    
    if (report.turnTest.relay && report.turnTest.srflx) {
      report.recommendations.push({
        level: 'success',
        message: 'WebRTC vollständig funktionsfähig. STUN und TURN server erreichbar.'
      });
    }
  } catch (error) {
    report.turnTest = { error: error.message };
    report.recommendations.push({
      level: 'error',
      message: `WebRTC Test fehlgeschlagen: ${error.message}`
    });
  }
  
  return report;
}

/**
 * Log WebRTC diagnostics to console (for debugging)
 */
export async function logWebRTCDiagnostics() {
  console.log('🔍 Running WebRTC Diagnostics...');
  
  const report = await runWebRTCDiagnostics();
  
  console.log('📊 WebRTC Diagnostics Report:');
  console.log('Browser Support:', report.browserSupport);
  console.log('TURN Test Results:', report.turnTest);
  console.log('Recommendations:', report.recommendations);
  
  return report;
}





