import { createContext, useState, useContext, useEffect } from "react";
import PropTypes from 'prop-types';
import axios from 'axios';

const CreditsContext = createContext();

export const useCredits = () => {
  const context = useContext(CreditsContext);
  if (!context) {
    throw new Error('useCredits must be used within a CreditsProvider');
  }
  return context;
};

export const CreditsProvider = ({ children }) => {
  const [credits, setCredits] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchCredits = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await axios.get('https://employee.ekaant.co/api/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data?.employee?.credits !== undefined) {
        setCredits(response.data.employee.credits);
        localStorage.setItem('credits', response.data.employee.credits);
      }
    } catch (error) {
      console.error('Error fetching credits:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCredits();

    const handleCreditsUpdate = () => {
      fetchCredits();
    };

    window.addEventListener('creditsUpdated', handleCreditsUpdate);
    return () => window.removeEventListener('creditsUpdated', handleCreditsUpdate);
  }, []);

  const updateCredits = async (newAmount, operation = 'set') => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');

      const response = await axios.post(
        'https://employee.ekaant.co/api/update-credits',
        { credits: newAmount, operation },
        { headers: { Authorization: `Bearer ${token}` }}
      );

      if (response.data?.success) {
        setCredits(response.data.credits);
        localStorage.setItem('credits', response.data.credits);
        return response.data.credits;
      }

      throw new Error(response.data?.message || 'Failed to update credits');
    } catch (error) {
      console.error('Credits update error:', error);
      throw error;
    }
  };

  const value = {
    credits,
    updateCredits,
    refreshCredits: fetchCredits,
    loading
  };

  return (
    <CreditsContext.Provider value={value}>
      {children}
    </CreditsContext.Provider>
  );
};

CreditsProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default CreditsProvider;