import React, { useState, useEffect } from 'react';
import { useAccount, useBalance, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther, formatEther } from 'viem';
import { toast, ToastContainer } from 'react-toastify';
import { CONTRACT_ADDRESSES, SIMPLE_BANK_ABI } from '../config/wagmi';
import 'react-toastify/dist/ReactToastify.css';
import './SimpleBank.css';

const SimpleBank = () => {
  const { address, isConnected, chain } = useAccount();
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { writeContract, data: hash, error, isPending } = useWriteContract();

  // Get contract address for current chain
  const contractAddress = chain ? CONTRACT_ADDRESSES[chain.id] : null;

  // Read user's balance from the contract
  const { data: userBalance, refetch: refetchUserBalance } = useReadContract({
    address: contractAddress,
    abi: SIMPLE_BANK_ABI,
    functionName: 'getMyBalance',
    account: address,
  });

  // Read contract's total balance
  const { data: contractBalance, refetch: refetchContractBalance } = useReadContract({
    address: contractAddress,
    abi: SIMPLE_BANK_ABI,
    functionName: 'getContractBalance',
  });

  // Read total deposits
  const { data: totalDeposits, refetch: refetchTotalDeposits } = useReadContract({
    address: contractAddress,
    abi: SIMPLE_BANK_ABI,
    functionName: 'totalDeposits',
  });

  // Get user's ETH balance
  const { data: ethBalance } = useBalance({
    address: address,
  });

  // Wait for transaction confirmation
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  // Handle successful transactions
  useEffect(() => {
    if (isConfirmed) {
      toast.success('Transaction confirmed!');
      refetchUserBalance();
      refetchContractBalance();
      refetchTotalDeposits();
      setDepositAmount('');
      setWithdrawAmount('');
      setIsLoading(false);
    }
  }, [isConfirmed, refetchUserBalance, refetchContractBalance, refetchTotalDeposits]);

  // Handle transaction errors
  useEffect(() => {
    if (error) {
      toast.error(`Transaction failed: ${error.message}`);
      setIsLoading(false);
    }
  }, [error]);

  const handleDeposit = async () => {
    if (!depositAmount || parseFloat(depositAmount) <= 0) {
      toast.error('Please enter a valid deposit amount');
      return;
    }

    if (!contractAddress) {
      toast.error('Contract not deployed on this network');
      return;
    }

    try {
      setIsLoading(true);
      writeContract({
        address: contractAddress,
        abi: SIMPLE_BANK_ABI,
        functionName: 'deposit',
        value: parseEther(depositAmount),
      });
    } catch (err) {
      toast.error('Failed to initiate deposit');
      setIsLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      toast.error('Please enter a valid withdrawal amount');
      return;
    }

    if (!contractAddress) {
      toast.error('Contract not deployed on this network');
      return;
    }

    try {
      setIsLoading(true);
      writeContract({
        address: contractAddress,
        abi: SIMPLE_BANK_ABI,
        functionName: 'withdraw',
        args: [parseEther(withdrawAmount)],
      });
    } catch (err) {
      toast.error('Failed to initiate withdrawal');
      setIsLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="simple-bank">
        <div className="connect-wallet">
          <h2>Welcome to SimpleBank</h2>
          <p>Connect your wallet to start banking with us!</p>
          <w3m-button />
        </div>
        <ToastContainer position="top-right" />
      </div>
    );
  }

  if (!contractAddress) {
    return (
      <div className="simple-bank">
        <div className="network-error">
          <h2>Network Not Supported</h2>
          <p>Please switch to a supported network (Base Sepolia or Sepolia)</p>
          <w3m-button />
        </div>
        <ToastContainer position="top-right" />
      </div>
    );
  }

  return (
    <div className="simple-bank">
      <div className="wallet-info">
        <div className="wallet-header">
          <h2>Your Wallet</h2>
          <w3m-button />
        </div>
        <div className="balance-grid">
          <div className="balance-card">
            <h3>ETH Balance</h3>
            <p className="balance-amount">
              {ethBalance ? formatEther(ethBalance.value) : '0'} ETH
            </p>
          </div>
          <div className="balance-card">
            <h3>Bank Balance</h3>
            <p className="balance-amount">
              {userBalance ? formatEther(userBalance) : '0'} ETH
            </p>
          </div>
        </div>
      </div>

      <div className="actions-section">
        <div className="action-card">
          <h3>💰 Deposit</h3>
          <div className="input-group">
            <input
              type="number"
              placeholder="Amount in ETH"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              step="0.001"
              min="0"
            />
            <button
              onClick={handleDeposit}
              disabled={isLoading || isPending || isConfirming}
              className="action-button deposit-button"
            >
              {isLoading || isPending || isConfirming ? 'Processing...' : 'Deposit'}
            </button>
          </div>
        </div>

        <div className="action-card">
          <h3>💸 Withdraw</h3>
          <div className="input-group">
            <input
              type="number"
              placeholder="Amount in ETH"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              step="0.001"
              min="0"
            />
            <button
              onClick={handleWithdraw}
              disabled={isLoading || isPending || isConfirming}
              className="action-button withdraw-button"
            >
              {isLoading || isPending || isConfirming ? 'Processing...' : 'Withdraw'}
            </button>
          </div>
        </div>
      </div>

      <div className="contract-info">
        <h3>📊 Contract Statistics</h3>
        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-label">Total Contract Balance:</span>
            <span className="stat-value">
              {contractBalance ? formatEther(contractBalance) : '0'} ETH
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Total Deposits:</span>
            <span className="stat-value">
              {totalDeposits ? formatEther(totalDeposits) : '0'} ETH
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Contract Address:</span>
            <span className="stat-value contract-address">
              {contractAddress}
            </span>
          </div>
        </div>
      </div>

      <ToastContainer position="top-right" />
    </div>
  );
};

export default SimpleBank;
