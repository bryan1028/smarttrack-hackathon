import React, { useState, useEffect, useRef } from 'react';
import { PlusCircle, Mic, Camera, TrendingUp, TrendingDown, DollarSign, BarChart3, Eye, EyeOff, Calendar, Tag, Trash2 } from 'lucide-react';

const SmartTrack = () => {
  const [transactions, setTransactions] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState({
    type: 'expense',
    amount: '',
    description: '',
    category: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [showBalance, setShowBalance] = useState(true);
  const [filter, setFilter] = useState('all');
  
  const fileInputRef = useRef(null);

  // Sample data for demo
  useEffect(() => {
    const sampleData = [
      { id: 1, type: 'income', amount: 150, description: 'Product Sales', category: 'Sales', date: '2025-05-26', time: '09:30' },
      { id: 2, type: 'expense', amount: 45, description: 'Office Supplies', category: 'Operations', date: '2025-05-26', time: '11:15' },
      { id: 3, type: 'income', amount: 320, description: 'Service Revenue', category: 'Services', date: '2025-05-25', time: '14:20' },
      { id: 4, type: 'expense', amount: 80, description: 'Marketing Materials', category: 'Marketing', date: '2025-05-25', time: '16:45' },
      { id: 5, type: 'income', amount: 200, description: 'Consultation Fee', category: 'Services', date: '2025-05-24', time: '10:00' }
    ];
    setTransactions(sampleData);
  }, []);

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const profit = totalIncome - totalExpenses;

  const handleVoiceInput = () => {
    if (!isRecording) {
      setIsRecording(true);
      // Simulate voice recognition
      setTimeout(() => {
        setIsRecording(false);
        setCurrentTransaction(prev => ({
          ...prev,
          description: 'Coffee supplies purchase',
          amount: '25',
          category: 'Inventory'
        }));
        setShowAddModal(true);
      }, 2000);
    }
  };

  const handlePhotoInput = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Simulate receipt scanning
      setTimeout(() => {
        setCurrentTransaction(prev => ({
          ...prev,
          description: 'Office rent payment',
          amount: '500',
          category: 'Operations'
        }));
        setShowAddModal(true);
      }, 1500);
    }
  };

  const addTransaction = () => {
    if (currentTransaction.amount && currentTransaction.description) {
      const newTransaction = {
        id: transactions.length + 1,
        ...currentTransaction,
        amount: parseFloat(currentTransaction.amount),
        time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })
      };
      setTransactions([newTransaction, ...transactions]);
      setCurrentTransaction({
        type: 'expense',
        amount: '',
        description: '',
        category: '',
        date: new Date().toISOString().split('T')[0]
      });
      setShowAddModal(false);
    }
  };

  const deleteTransaction = (id) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  const filteredTransactions = transactions.filter(t => 
    filter === 'all' || t.type === filter
  );

  const categories = ['Sales', 'Services', 'Operations', 'Marketing', 'Inventory', 'Utilities', 'Other'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-white/20 sticky top-0 z-40">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                SmartTrack
              </h1>
              <p className="text-sm text-gray-600">Business Finance Tracker</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowBalance(!showBalance)}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                {showBalance ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 pb-20">
        {/* Balance Cards */}
        <div className="grid grid-cols-3 gap-3 my-6">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 border border-white/30 shadow-lg">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="text-green-500" size={18} />
              <span className="text-xs font-medium text-gray-600">Income</span>
            </div>
            <p className="text-lg font-bold text-green-600">
              {showBalance ? `$${totalIncome.toFixed(2)}` : '••••'}
            </p>
          </div>
          
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 border border-white/30 shadow-lg">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="text-red-500" size={18} />
              <span className="text-xs font-medium text-gray-600">Expenses</span>
            </div>
            <p className="text-lg font-bold text-red-600">
              {showBalance ? `$${totalExpenses.toFixed(2)}` : '••••'}
            </p>
          </div>
          
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 border border-white/30 shadow-lg">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className={`${profit >= 0 ? 'text-green-500' : 'text-red-500'}`} size={18} />
              <span className="text-xs font-medium text-gray-600">Profit</span>
            </div>
            <p className={`text-lg font-bold ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {showBalance ? `$${profit.toFixed(2)}` : '••••'}
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={handleVoiceInput}
            disabled={isRecording}
            className={`flex-1 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-2xl p-4 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all transform hover:scale-105 ${isRecording ? 'animate-pulse' : ''}`}
          >
            <Mic size={20} />
            <span className="font-medium">
              {isRecording ? 'Listening...' : 'Voice Add'}
            </span>
          </button>
          
          <button
            onClick={handlePhotoInput}
            className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl p-4 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
          >
            <Camera size={20} />
            <span className="font-medium">Scan Receipt</span>
          </button>
          
          <button
            onClick={() => setShowAddModal(true)}
            className="flex-1 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-2xl p-4 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
          >
            <PlusCircle size={20} />
            <span className="font-medium">Manual Add</span>
          </button>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2 mb-4">
          {['all', 'income', 'expense'].map((filterType) => (
            <button
              key={filterType}
              onClick={() => setFilter(filterType)}
              className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-all ${
                filter === filterType
                  ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg'
                  : 'bg-white/70 text-gray-600 hover:bg-white/90'
              }`}
            >
              {filterType}
            </button>
          ))}
        </div>

        {/* Transactions List */}
        <div className="space-y-3">
          {filteredTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 border border-white/30 shadow-lg hover:shadow-xl transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`w-2 h-2 rounded-full ${transaction.type === 'income' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                    <h3 className="font-semibold text-gray-800">{transaction.description}</h3>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Tag size={14} />
                      {transaction.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar size={14} />
                      {transaction.date} {transaction.time}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-lg font-bold ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                    {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                  </span>
                  <button
                    onClick={() => deleteTransaction(transaction.id)}
                    className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Transaction Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end">
          <div className="bg-white rounded-t-3xl w-full max-w-md mx-auto p-6 space-y-4 animate-in slide-in-from-bottom duration-300">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">Add Transaction</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            
            <div className="flex gap-2 mb-4">
              {['expense', 'income'].map((type) => (
                <button
                  key={type}
                  onClick={() => setCurrentTransaction(prev => ({ ...prev, type }))}
                  className={`flex-1 py-2 rounded-xl text-sm font-medium capitalize transition-all ${
                    currentTransaction.type === type
                      ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            <input
              type="number"
              placeholder="Amount ($)"
              value={currentTransaction.amount}
              onChange={(e) => setCurrentTransaction(prev => ({ ...prev, amount: e.target.value }))}
              className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
            />

            <input
              type="text"
              placeholder="Description"
              value={currentTransaction.description}
              onChange={(e) => setCurrentTransaction(prev => ({ ...prev, description: e.target.value }))}
              className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
            />

            <select
              value={currentTransaction.category}
              onChange={(e) => setCurrentTransaction(prev => ({ ...prev, category: e.target.value }))}
              className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Select Category</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            <input
              type="date"
              value={currentTransaction.date}
              onChange={(e) => setCurrentTransaction(prev => ({ ...prev, date: e.target.value }))}
              className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
            />

            <button
              onClick={addTransaction}
              className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all"
            >
              Add Transaction
            </button>
          </div>
        </div>
      )}

      {/* Hidden file input for photo capture */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};

export default SmartTrack;
