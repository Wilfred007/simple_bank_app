const {
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SimpleBank", function () {
  // Fixture to deploy the SimpleBank contract
  async function deploySimpleBankFixture() {
    const [owner, addr1, addr2] = await ethers.getSigners();

    const SimpleBank = await ethers.getContractFactory("SimpleBank");
    const simpleBank = await SimpleBank.deploy();

    return { simpleBank, owner, addr1, addr2 };
  }

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      const { simpleBank, owner } = await loadFixture(deploySimpleBankFixture);

      expect(await simpleBank.owner()).to.equal(owner.address);
    });

    it("Should initialize totalDeposits to 0", async function () {
      const { simpleBank } = await loadFixture(deploySimpleBankFixture);

      expect(await simpleBank.totalDeposits()).to.equal(0);
    });

    it("Should have zero contract balance initially", async function () {
      const { simpleBank } = await loadFixture(deploySimpleBankFixture);

      expect(await simpleBank.getContractBalance()).to.equal(0);
    });
  });

  describe("Deposits", function () {
    it("Should allow users to deposit ETH", async function () {
      const { simpleBank, addr1 } = await loadFixture(deploySimpleBankFixture);
      const depositAmount = ethers.parseEther("1.0");

      await expect(
        simpleBank.connect(addr1).deposit({ value: depositAmount })
      ).to.not.be.reverted;

      expect(await simpleBank.getBalance(addr1.address)).to.equal(depositAmount);
      expect(await simpleBank.totalDeposits()).to.equal(depositAmount);
    });

    it("Should emit Deposit event", async function () {
      const { simpleBank, addr1 } = await loadFixture(deploySimpleBankFixture);
      const depositAmount = ethers.parseEther("1.0");

      await expect(
        simpleBank.connect(addr1).deposit({ value: depositAmount })
      )
        .to.emit(simpleBank, "Deposit")
        .withArgs(addr1.address, depositAmount);
    });

    it("Should reject deposits of 0 ETH", async function () {
      const { simpleBank, addr1 } = await loadFixture(deploySimpleBankFixture);

      await expect(
        simpleBank.connect(addr1).deposit({ value: 0 })
      ).to.be.revertedWith("Deposit amount must be greater than 0");
    });

    it("Should allow multiple deposits from same user", async function () {
      const { simpleBank, addr1 } = await loadFixture(deploySimpleBankFixture);
      const firstDeposit = ethers.parseEther("1.0");
      const secondDeposit = ethers.parseEther("0.5");

      await simpleBank.connect(addr1).deposit({ value: firstDeposit });
      await simpleBank.connect(addr1).deposit({ value: secondDeposit });

      expect(await simpleBank.getBalance(addr1.address)).to.equal(
        firstDeposit + secondDeposit
      );
      expect(await simpleBank.totalDeposits()).to.equal(
        firstDeposit + secondDeposit
      );
    });

    it("Should track deposits from multiple users separately", async function () {
      const { simpleBank, addr1, addr2 } = await loadFixture(deploySimpleBankFixture);
      const deposit1 = ethers.parseEther("1.0");
      const deposit2 = ethers.parseEther("2.0");

      await simpleBank.connect(addr1).deposit({ value: deposit1 });
      await simpleBank.connect(addr2).deposit({ value: deposit2 });

      expect(await simpleBank.getBalance(addr1.address)).to.equal(deposit1);
      expect(await simpleBank.getBalance(addr2.address)).to.equal(deposit2);
      expect(await simpleBank.totalDeposits()).to.equal(deposit1 + deposit2);
    });
  });

  describe("Withdrawals", function () {
    it("Should allow users to withdraw their deposited ETH", async function () {
      const { simpleBank, addr1 } = await loadFixture(deploySimpleBankFixture);
      const depositAmount = ethers.parseEther("1.0");
      const withdrawAmount = ethers.parseEther("0.5");

      await simpleBank.connect(addr1).deposit({ value: depositAmount });
      
      const initialBalance = await ethers.provider.getBalance(addr1.address);
      const tx = await simpleBank.connect(addr1).withdraw(withdrawAmount);
      const receipt = await tx.wait();
      const gasUsed = receipt.gasUsed * receipt.gasPrice;

      expect(await simpleBank.getBalance(addr1.address)).to.equal(
        depositAmount - withdrawAmount
      );
      expect(await simpleBank.totalDeposits()).to.equal(
        depositAmount - withdrawAmount
      );
      
      const finalBalance = await ethers.provider.getBalance(addr1.address);
      expect(finalBalance).to.equal(initialBalance + withdrawAmount - gasUsed);
    });

    it("Should emit Withdrawal event", async function () {
      const { simpleBank, addr1 } = await loadFixture(deploySimpleBankFixture);
      const depositAmount = ethers.parseEther("1.0");
      const withdrawAmount = ethers.parseEther("0.5");

      await simpleBank.connect(addr1).deposit({ value: depositAmount });

      await expect(
        simpleBank.connect(addr1).withdraw(withdrawAmount)
      )
        .to.emit(simpleBank, "Withdrawal")
        .withArgs(addr1.address, withdrawAmount);
    });

    it("Should reject withdrawal of 0 ETH", async function () {
      const { simpleBank, addr1 } = await loadFixture(deploySimpleBankFixture);
      const depositAmount = ethers.parseEther("1.0");

      await simpleBank.connect(addr1).deposit({ value: depositAmount });

      await expect(
        simpleBank.connect(addr1).withdraw(0)
      ).to.be.revertedWith("Withdrawal amount must be greater than 0");
    });

    it("Should reject withdrawal when insufficient balance", async function () {
      const { simpleBank, addr1 } = await loadFixture(deploySimpleBankFixture);
      const depositAmount = ethers.parseEther("1.0");
      const withdrawAmount = ethers.parseEther("2.0");

      await simpleBank.connect(addr1).deposit({ value: depositAmount });

      await expect(
        simpleBank.connect(addr1).withdraw(withdrawAmount)
      ).to.be.revertedWith("Insufficient balance");
    });

    it("Should reject withdrawal when no balance", async function () {
      const { simpleBank, addr1 } = await loadFixture(deploySimpleBankFixture);
      const withdrawAmount = ethers.parseEther("1.0");

      await expect(
        simpleBank.connect(addr1).withdraw(withdrawAmount)
      ).to.be.revertedWith("Insufficient balance");
    });

    it("Should allow complete withdrawal of balance", async function () {
      const { simpleBank, addr1 } = await loadFixture(deploySimpleBankFixture);
      const depositAmount = ethers.parseEther("1.0");

      await simpleBank.connect(addr1).deposit({ value: depositAmount });
      await simpleBank.connect(addr1).withdraw(depositAmount);

      expect(await simpleBank.getBalance(addr1.address)).to.equal(0);
      expect(await simpleBank.totalDeposits()).to.equal(0);
    });
  });

  describe("Balance Queries", function () {
    it("Should return correct balance for getMyBalance", async function () {
      const { simpleBank, addr1 } = await loadFixture(deploySimpleBankFixture);
      const depositAmount = ethers.parseEther("1.0");

      await simpleBank.connect(addr1).deposit({ value: depositAmount });

      expect(await simpleBank.connect(addr1).getMyBalance()).to.equal(depositAmount);
    });

    it("Should return 0 balance for users who haven't deposited", async function () {
      const { simpleBank, addr1 } = await loadFixture(deploySimpleBankFixture);

      expect(await simpleBank.getBalance(addr1.address)).to.equal(0);
      expect(await simpleBank.connect(addr1).getMyBalance()).to.equal(0);
    });

    it("Should return correct contract balance", async function () {
      const { simpleBank, addr1, addr2 } = await loadFixture(deploySimpleBankFixture);
      const deposit1 = ethers.parseEther("1.0");
      const deposit2 = ethers.parseEther("2.0");

      await simpleBank.connect(addr1).deposit({ value: deposit1 });
      await simpleBank.connect(addr2).deposit({ value: deposit2 });

      expect(await simpleBank.getContractBalance()).to.equal(deposit1 + deposit2);
    });
  });

  describe("Emergency Withdraw", function () {
    it("Should allow owner to emergency withdraw all funds", async function () {
      const { simpleBank, owner, addr1 } = await loadFixture(deploySimpleBankFixture);
      const depositAmount = ethers.parseEther("1.0");

      await simpleBank.connect(addr1).deposit({ value: depositAmount });

      const initialOwnerBalance = await ethers.provider.getBalance(owner.address);
      const tx = await simpleBank.connect(owner).emergencyWithdraw();
      const receipt = await tx.wait();
      const gasUsed = receipt.gasUsed * receipt.gasPrice;

      const finalOwnerBalance = await ethers.provider.getBalance(owner.address);
      expect(finalOwnerBalance).to.equal(
        initialOwnerBalance + depositAmount - gasUsed
      );
      expect(await simpleBank.getContractBalance()).to.equal(0);
    });

    it("Should reject emergency withdraw from non-owner", async function () {
      const { simpleBank, addr1 } = await loadFixture(deploySimpleBankFixture);
      const depositAmount = ethers.parseEther("1.0");

      await simpleBank.connect(addr1).deposit({ value: depositAmount });

      await expect(
        simpleBank.connect(addr1).emergencyWithdraw()
      ).to.be.revertedWith("Only owner can call this function");
    });

    it("Should reject emergency withdraw when no funds", async function () {
      const { simpleBank, owner } = await loadFixture(deploySimpleBankFixture);

      await expect(
        simpleBank.connect(owner).emergencyWithdraw()
      ).to.be.revertedWith("No funds to withdraw");
    });
  });

  describe("Complex Scenarios", function () {
    it("Should handle multiple users depositing and withdrawing", async function () {
      const { simpleBank, addr1, addr2 } = await loadFixture(deploySimpleBankFixture);
      const deposit1 = ethers.parseEther("1.0");
      const deposit2 = ethers.parseEther("2.0");
      const withdraw1 = ethers.parseEther("0.5");

      // Both users deposit
      await simpleBank.connect(addr1).deposit({ value: deposit1 });
      await simpleBank.connect(addr2).deposit({ value: deposit2 });

      // addr1 withdraws some funds
      await simpleBank.connect(addr1).withdraw(withdraw1);

      expect(await simpleBank.getBalance(addr1.address)).to.equal(deposit1 - withdraw1);
      expect(await simpleBank.getBalance(addr2.address)).to.equal(deposit2);
      expect(await simpleBank.totalDeposits()).to.equal(deposit1 + deposit2 - withdraw1);
      expect(await simpleBank.getContractBalance()).to.equal(deposit1 + deposit2 - withdraw1);
    });
  });
});
