import React, { useState, useEffect } from 'react';
import { transactionService } from './services/transactionService';
import { Transaction, Region, TransactionStatus } from './models/transaction.model';
import { TransactionForm } from './components/Transaction/TransactionForm';
import { TransactionList } from './components/Transaction/TransactionList';

const App: React.FC = () => {
    const [regions, setRegions] = useState<Region[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isLoadingInitial, setIsLoadingInitial] = useState<boolean>(true);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    // טעינת נתונים ראשונית מה-Backend
    useEffect(() => {
        const loadInitialData = async () => {
            setIsLoadingInitial(true);
            try {
                // שאיבת נתונים במקביל
                const [regionsData, transactionsData] = await Promise.all([
                    transactionService.getRegions(),
                    transactionService.getTransactions()
                ]);

                setRegions(regionsData);
                // מכיוון שה-API מחזיר מערך ישיר לפי ה-JSON ששלחת
                setTransactions(transactionsData || []);
            } catch (error) {
                console.error("Error loading data:", error);
            } finally {
                setIsLoadingInitial(false);
            }
        };

        loadInitialData();
    }, []);

    const handleTransactionSubmit = async (regionId: number, hour: string, minute: string) => {
        setIsSubmitting(true);
        try {
            const result = await transactionService.createAndSendTransaction(regionId, hour, minute);
            
            // רענון הרשימה לאחר שליחה מוצלחת
            const updatedTransactions = await transactionService.getTransactions();
            setTransactions(updatedTransactions || []);
            
            alert(result.status === "Approved" ? "Transaction Approved! ✅" : "Transaction Rejected! ❌");
        } catch (error) {
            console.error("Submit error:", error);
            alert("API Connection Error");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8F9FB] font-sans">
            <nav className="flex justify-between items-center px-12 py-8 bg-white border-b border-gray-100">
                <div className="text-3xl font-black italic text-[#00a3e0] tracking-tighter">
                    shva<span className="text-gray-200">.</span>simulator
                </div>
            </nav>

            <main className="max-w-7xl mx-auto pt-20 px-8">
                <div className="flex flex-col lg:flex-row items-start justify-between gap-24">
                    <TransactionForm 
                        regions={regions} 
                        onSubmit={handleTransactionSubmit} 
                        isSubmitting={isSubmitting} 
                    />
                    
                    <div className="flex-1 pt-4 text-[#2D1F5B]">
                        <h1 className="text-7xl font-black leading-[1] mb-8 tracking-tighter">
                            Check Bank <br />
                            <span className="text-[#7B61FF]">Availability.</span>
                        </h1>
                        <p className="text-gray-500 text-xl max-w-xl">
                            Validation of global transactions based on regional business hours and time zones.
                        </p>
                    </div>
                </div>

                <section className="mt-40 mb-20">
                    <TransactionList 
                        transactions={transactions} 
                        isLoading={isLoadingInitial} 
                    />
                </section>
            </main>
        </div>
    );
};

export default App;