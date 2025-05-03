import { QueryClient } from "@tanstack/react-query";
import { mockCandidates, mockTopCandidates, mockAnalyticsData, mockUser } from '@/mock/data';

// Mock implementation of the queryClient that uses the mock data
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: false,
    },
  },
});

// Set initial data in the cache
queryClient.setQueryData(['/api/candidates'], { 
  candidates: mockCandidates,
  total: mockCandidates.length
});
queryClient.setQueryData(['/api/candidates/top-picks'], mockTopCandidates);
queryClient.setQueryData(['/api/analytics'], mockAnalyticsData);
queryClient.setQueryData(['/api/user'], mockUser);
queryClient.setQueryData(['/api/resumes/status'], {
  status: 'processing',
  total: 10,
  processed: 0,
  failed: 0
});

// Helper function for mock API requests
export async function apiRequest(
  method: string,
  endpoint: string,
  body?: any,
): Promise<Response> {
  console.log(`Mock ${method} request to ${endpoint}`, body);
  
  // Return a mock successful response
  const mockResponse = new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  // Handle specific endpoints
  if (endpoint === '/api/login' || endpoint === '/api/register') {
    // Return the mock user for login/register
    return new Response(JSON.stringify(mockUser), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
  
  if (endpoint.includes('/api/candidates') && endpoint.includes('/reject')) {
    // Update local cache for reject action
    const candidateId = parseInt(endpoint.split('/')[3]);
    const currentCandidates = queryClient.getQueryData<{candidates: typeof mockCandidates}>(['/api/candidates']);
    
    if (currentCandidates) {
      const updatedCandidates = currentCandidates.candidates.map(candidate => {
        if (candidate.id === candidateId) {
          return {
            ...candidate,
            status: 'Rejected',
            rejectionReason: body.reason,
            rejectionNotes: body.notes,
          };
        }
        return candidate;
      });
      
      queryClient.setQueryData(['/api/candidates'], { 
        candidates: updatedCandidates,
        total: updatedCandidates.length
      });
    }
  }
  
  if (endpoint.includes('/api/candidates') && endpoint.includes('/status')) {
    // Update local cache for status update action
    const candidateId = parseInt(endpoint.split('/')[3]);
    const currentCandidates = queryClient.getQueryData<{candidates: typeof mockCandidates}>(['/api/candidates']);
    
    if (currentCandidates) {
      const updatedCandidates = currentCandidates.candidates.map(candidate => {
        if (candidate.id === candidateId) {
          return {
            ...candidate,
            status: body.status,
          };
        }
        return candidate;
      });
      
      queryClient.setQueryData(['/api/candidates'], { 
        candidates: updatedCandidates,
        total: updatedCandidates.length
      });
      
      // Update analytics data to reflect the status change
      const analyticsData = queryClient.getQueryData<typeof mockAnalyticsData>(['/api/analytics']);
      if (analyticsData) {
        // This is a simplified update - in a real app, we would recalculate all the analytics
        queryClient.setQueryData(['/api/analytics'], {
          ...analyticsData,
        });
      }
    }
  }
  
  // Handle resume upload endpoints
  if (endpoint === '/api/resumes/upload') {
    // Simulate a successful upload
    return new Response(JSON.stringify({ success: true, uploadId: 123 }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
  
  if (endpoint === '/api/resumes/status') {
    // Simulate the processing status
    const mockStatus = {
      status: 'processing',
      total: 10,
      processed: 7,
      failed: 0
    };
    
    // After a few calls, return completed status
    const existingStatus = queryClient.getQueryData<typeof mockStatus>(['/api/resumes/status']);
    if (existingStatus) {
      if (existingStatus.processed < existingStatus.total) {
        mockStatus.processed = existingStatus.processed + 1;
      } else {
        mockStatus.status = 'completed';
      }
    }
    
    queryClient.setQueryData(['/api/resumes/status'], mockStatus);
    
    return new Response(JSON.stringify(mockStatus), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
  
  return mockResponse;
}

// Replacement for getQueryFn that uses mock data
export const getQueryFn = <T>(_options: { on401: "returnNull" | "throw" }) => {
  return async (context: any): Promise<T | null> => {
    const endpoint = context.queryKey[0];
    console.log(`Mock GET request to ${endpoint}`);
    
    // Return cached data
    return queryClient.getQueryData<T>(context.queryKey) || null;
  };
};