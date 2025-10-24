import React from 'react';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createWeb3Modal } from '@web3modal/wagmi/react';
import { config, projectId } from './config/wagmi';
import SimpleBank from './components/SimpleBank';
import './App.css';

// Create a client
const queryClient = new QueryClient();

// Create modal
createWeb3Modal({
  wagmiConfig: config,
  projectId,
  enableAnalytics: true, // Optional - defaults to your Cloud configuration
});

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <div className="App">
          <header className="App-header">
            <h1>🏦 SimpleBank DApp</h1>
            <p>Your decentralized banking solution</p>
          </header>
          <main>
            <SimpleBank />
          </main>
        </div>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
