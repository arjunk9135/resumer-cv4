import React, { useState } from 'react';
import FileUploader from '@/components/FileUploader';
import CandidateTable from '@/components/CandidateTable';
import Dashboard from '@/components/Dashboard';
import TopPicksSection from '@/components/TopPicksSection';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/mockQueryClient';
import { queryClient } from '@/lib/mockQueryClient';

const Home: React.FC = () => {
  const { toast } = useToast();
  const [dataUpdated, setDataUpdated] = useState(false);

  const handleUploadComplete = () => {
    setDataUpdated(true);
    toast({
      title: "Analysis complete",
      description: "Resume analysis has been completed successfully.",
      variant: "default"
    });
  };

  const handleRejectCandidate = async (id: number, reason: string, notes?: string) => {
    try {
      await apiRequest('PATCH', `/api/candidates/${id}/reject`, { reason, notes });
      
      toast({
        title: "Candidate rejected",
        description: "The candidate has been marked as rejected.",
        variant: "default"
      });
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['/api/candidates'] });
      queryClient.invalidateQueries({ queryKey: ['/api/analytics'] });
    } catch (error) {
      toast({
        title: "Rejection failed",
        description: "Failed to reject the candidate. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      </div>
      
      <FileUploader onUploadComplete={handleUploadComplete} />
      <CandidateTable onReject={handleRejectCandidate} />
      <Dashboard />
      <TopPicksSection />
    </div>
  );
};

export default Home;
