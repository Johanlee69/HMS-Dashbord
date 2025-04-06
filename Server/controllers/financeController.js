import Bill from '../models/Bill.js';
import InsuranceClaim from '../models/InsuranceClaim.js';

// Get all bills
export const getAllBills = async (req, res) => {
  try {
    const bills = await Bill.find({})
      .populate('patient', 'name contactNumber')
      .sort({ billDate: -1 });
    
    res.json(bills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single bill
export const getBillById = async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id)
      .populate('patient', 'name contactNumber email')
      .populate('admission', 'admissionDate dischargeDate')
      .populate('appointment', 'date time purpose');
    
    if (!bill) {
      return res.status(404).json({ message: 'Bill not found' });
    }
    
    res.json(bill);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new bill
export const createBill = async (req, res) => {
  try {
    const bill = new Bill(req.body);
    const createdBill = await bill.save();
    res.status(201).json(createdBill);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a bill
export const updateBill = async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id);
    if (!bill) {
      return res.status(404).json({ message: 'Bill not found' });
    }
    
    Object.assign(bill, req.body);
    const updatedBill = await bill.save();
    res.json(updatedBill);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get bills by status
export const getBillsByStatus = async (req, res) => {
  try {
    const bills = await Bill.find({ paymentStatus: req.params.status })
      .populate('patient', 'name contactNumber')
      .sort({ dueDate: 1 });
    
    res.json(bills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get patient bills
export const getPatientBills = async (req, res) => {
  try {
    const bills = await Bill.find({ patient: req.params.patientId })
      .sort({ billDate: -1 });
    
    res.json(bills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all insurance claims
export const getAllInsuranceClaims = async (req, res) => {
  try {
    const claims = await InsuranceClaim.find({})
      .populate('patient', 'name contactNumber')
      .populate('bill', 'totalAmount billDate')
      .sort({ submissionDate: -1 });
    
    res.json(claims);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single insurance claim
export const getInsuranceClaimById = async (req, res) => {
  try {
    const claim = await InsuranceClaim.findById(req.params.id)
      .populate('patient', 'name contactNumber email')
      .populate('bill', 'totalAmount billDate items');
    
    if (!claim) {
      return res.status(404).json({ message: 'Insurance claim not found' });
    }
    
    res.json(claim);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new insurance claim
export const createInsuranceClaim = async (req, res) => {
  try {
    const claim = new InsuranceClaim(req.body);
    const createdClaim = await claim.save();
    res.status(201).json(createdClaim);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update an insurance claim
export const updateInsuranceClaim = async (req, res) => {
  try {
    const claim = await InsuranceClaim.findById(req.params.id);
    if (!claim) {
      return res.status(404).json({ message: 'Insurance claim not found' });
    }
    
    Object.assign(claim, req.body);
    const updatedClaim = await claim.save();
    res.json(updatedClaim);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get insurance claims by status
export const getInsuranceClaimsByStatus = async (req, res) => {
  try {
    const claims = await InsuranceClaim.find({ status: req.params.status })
      .populate('patient', 'name')
      .populate('bill', 'totalAmount')
      .sort({ submissionDate: -1 });
    
    res.json(claims);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get revenue statistics
export const getRevenueStats = async (req, res) => {
  try {
    const startDate = req.query.startDate ? new Date(req.query.startDate) : new Date(new Date().setMonth(new Date().getMonth() - 6));
    const endDate = req.query.endDate ? new Date(req.query.endDate) : new Date();
    
    // Total revenue
    const bills = await Bill.find({ 
      billDate: { $gte: startDate, $lte: endDate } 
    });
    
    const totalBilled = bills.reduce((sum, bill) => sum + bill.totalAmount, 0);
    const totalPaid = bills.reduce((sum, bill) => sum + bill.paidAmount, 0);
    
    // Payment method breakdown
    const paymentMethodBreakdown = await Bill.aggregate([
      { $match: { billDate: { $gte: startDate, $lte: endDate } } },
      { $group: { 
        _id: '$paymentMethod', 
        count: { $sum: 1 },
        total: { $sum: '$paidAmount' } 
      }}
    ]);
    
    // Bill type breakdown
    const billTypeBreakdown = await Bill.aggregate([
      { $match: { billDate: { $gte: startDate, $lte: endDate } } },
      { $group: { 
        _id: '$billType', 
        count: { $sum: 1 },
        total: { $sum: '$totalAmount' } 
      }}
    ]);
    
    // Generate monthly data for charts
    const monthlyData = [];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Get the last 6 months
    const today = new Date();
    for (let i = 5; i >= 0; i--) {
      const month = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthEnd = new Date(today.getFullYear(), today.getMonth() - i + 1, 0);
      
      // Get bills for this month
      const monthlyBills = bills.filter(bill => {
        const billDate = new Date(bill.billDate);
        return billDate >= month && billDate <= monthEnd;
      });
      
      const monthlyRevenue = monthlyBills.reduce((sum, bill) => sum + bill.paidAmount, 0);
      // Estimate expenses as 70% of revenue for demonstration
      const monthlyExpenses = Math.round(monthlyRevenue * 0.7);
      
      monthlyData.push({
        month: monthNames[month.getMonth()],
        revenue: monthlyRevenue,
        expenses: monthlyExpenses
      });
    }
    
    res.json({
      period: { startDate, endDate },
      totalBilled,
      totalPaid,
      outstanding: totalBilled - totalPaid,
      paymentMethodBreakdown,
      billTypeBreakdown,
      monthlyData,
      labels: monthlyData.map(item => item.month),
      datasets: [
        {
          label: 'Revenue',
          data: monthlyData.map(item => item.revenue),
          backgroundColor: '#3B82F6'
        },
        {
          label: 'Expenses',
          data: monthlyData.map(item => item.expenses),
          backgroundColor: '#F97316'
        }
      ]
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Record a payment for a bill
export const recordPayment = async (req, res) => {
  try {
    const { amount } = req.body;
    
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      return res.status(400).json({ message: 'Valid payment amount is required' });
    }
    
    const bill = await Bill.findById(req.params.billId);
    if (!bill) {
      return res.status(404).json({ message: 'Bill not found' });
    }
    
    // Calculate new paid amount
    const newPaidAmount = parseFloat(bill.paidAmount || 0) + parseFloat(amount);
    
    // Ensure paid amount doesn't exceed total amount
    if (newPaidAmount > bill.totalAmount) {
      return res.status(400).json({ 
        message: `Payment amount exceeds remaining balance. Maximum payment allowed: ₹${(bill.totalAmount - bill.paidAmount).toFixed(2)}` 
      });
    }
    
    // Update bill with new paid amount and payment status
    bill.paidAmount = newPaidAmount;
    
    // Determine payment status
    if (newPaidAmount >= bill.totalAmount) {
      bill.paymentStatus = 'Paid';
    } else if (newPaidAmount > 0) {
      bill.paymentStatus = 'Partial';
    }
    
    // Record the payment
    if (!bill.payments) {
      bill.payments = [];
    }
    
    bill.payments.push({
      amount: parseFloat(amount),
      date: new Date(),
      method: req.body.method || 'Cash'
    });
    
    await bill.save();
    
    res.json({ 
      message: 'Payment recorded successfully',
      bill: {
        _id: bill._id,
        totalAmount: bill.totalAmount,
        paidAmount: bill.paidAmount,
        paymentStatus: bill.paymentStatus
      }
    });
  } catch (error) {
    console.error('Error recording payment:', error);
    res.status(500).json({ message: error.message });
  }
};

// Delete a bill
export const deleteBill = async (req, res) => {
  try {
    console.log(`Attempting to delete bill with ID: ${req.params.id}`);
    const result = await Bill.findByIdAndDelete(req.params.id);
    
    if (!result) {
      return res.status(404).json({ message: 'Bill not found' });
    }
    
    console.log('Bill deleted successfully:', result);
    res.json({ message: 'Bill deleted successfully', id: req.params.id });
  } catch (error) {
    console.error('Error deleting bill:', error);
    res.status(500).json({ message: error.message });
  }
};

// Update insurance claim status
export const updateClaimStatus = async (req, res) => {
  try {
    const { status, approvedAmount } = req.body;
    
    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }
    
    const claim = await InsuranceClaim.findById(req.params.id);
    if (!claim) {
      return res.status(404).json({ message: 'Insurance claim not found' });
    }
    
    claim.status = status;
    
    if (approvedAmount !== undefined && approvedAmount !== null) {
      claim.approvedAmount = parseFloat(approvedAmount);
    }
    
    const updatedClaim = await claim.save();
    res.json(updatedClaim);
  } catch (error) {
    console.error('Error updating claim status:', error);
    res.status(400).json({ message: error.message });
  }
};

// Delete an insurance claim
export const deleteInsuranceClaim = async (req, res) => {
  try {
    console.log(`Attempting to delete insurance claim with ID: ${req.params.id}`);
    const result = await InsuranceClaim.findByIdAndDelete(req.params.id);
    
    if (!result) {
      return res.status(404).json({ message: 'Insurance claim not found' });
    }
    
    console.log('Insurance claim deleted successfully:', result);
    res.json({ message: 'Insurance claim deleted successfully', id: req.params.id });
  } catch (error) {
    console.error('Error deleting insurance claim:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get insurance claims for a specific patient
export const getPatientInsuranceClaims = async (req, res) => {
  try {
    const claims = await InsuranceClaim.find({ patient: req.params.patientId })
      .populate('bill', 'totalAmount billDate')
      .sort({ submissionDate: -1 });
    
    res.json(claims);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get pending payments
export const getPendingPayments = async (req, res) => {
  try {
    const pendingBills = await Bill.find({ 
      paymentStatus: { $in: ['Pending', 'Partial'] } 
    })
      .populate('patient', 'name contactNumber')
      .sort({ dueDate: 1 });
    
    const total = pendingBills.reduce((sum, bill) => {
      return sum + (bill.totalAmount - bill.paidAmount);
    }, 0);
    
    res.json({
      bills: pendingBills,
      totalPending: total,
      count: pendingBills.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get overdue payments
export const getOverduePayments = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const overdueBills = await Bill.find({ 
      paymentStatus: { $in: ['Pending', 'Partial'] },
      dueDate: { $lt: today }
    })
      .populate('patient', 'name contactNumber')
      .sort({ dueDate: 1 });
    
    const total = overdueBills.reduce((sum, bill) => {
      return sum + (bill.totalAmount - bill.paidAmount);
    }, 0);
    
    res.json({
      bills: overdueBills,
      totalOverdue: total,
      count: overdueBills.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 