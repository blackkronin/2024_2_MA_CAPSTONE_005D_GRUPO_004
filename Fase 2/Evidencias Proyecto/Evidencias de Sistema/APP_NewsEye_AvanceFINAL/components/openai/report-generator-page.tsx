"use client";

import React, { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/utils/supabase/client';
import OpenAIReportGen from '@/components/openai/openai_report_gen';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

interface Report {
  name: string;
  id: string;
  category: string;
}

const ReportGeneratorPage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [reports, setReports] = useState<Report[]>([]);

  useEffect(() => {
    const fetchUserAndReports = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        await createUserFolder(user.id);
        await fetchUserReports(user.id);
      }
    };

    fetchUserAndReports();
  }, []);

  const createUserFolder = async (userId: string) => {
    const folderName = `reports_user_${userId}`;
    const { data, error } = await supabase.storage
      .from('AllReports')
      .list(folderName);

    if (error || !data || data.length === 0) {
      // Folder doesn't exist, create it
      const { error: createError } = await supabase.storage
        .from('AllReports')
        .upload(`${folderName}/.keep`, new Blob(['']));

      if (createError) {
        console.error('Error creating user folder:', createError);
      }
    }
  };

  const fetchUserReports = async (userId: string) => {
    const { data, error } = await supabase.storage
      .from('AllReports')
      .list(`reports_user_${userId}`);

    if (error) {
      console.error('Error fetching reports:', error);
    } else {
      const reportsList: Report[] = data
        .filter(item => !item.name.endsWith('/'))
        .map(item => ({
          name: item.name,
          id: item.id,
          category: item.metadata?.category || 'Uncategorized'
        }));
      setReports(reportsList);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" className="fixed top-4 left-4 z-10">
            Mis Reportes
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[300px] sm:w-[400px]">
          <h2 className="text-2xl font-bold mb-4">Mis Reportes</h2>
          {reports.map((report) => (
            <Button
              key={report.id}
              variant="ghost"
              className="w-full justify-start mb-2"
              onClick={() => {/* Implement view report logic */}}
            >
              {report.name}
            </Button>
          ))}
        </SheetContent>
      </Sheet>
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-6">Generador de Reportes</h1>
        <OpenAIReportGen />
      </main>
    </div>
  );
};

export default ReportGeneratorPage;