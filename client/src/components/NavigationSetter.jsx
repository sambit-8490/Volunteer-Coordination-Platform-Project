import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { setNavigate } from '../api';

const NavigationSetter = () => {
  const navigate = useNavigate();
  useEffect(() => {
    setNavigate(navigate);
  }, [navigate]);
  return null;
};

export default NavigationSetter;
