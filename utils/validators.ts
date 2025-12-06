export const validateThaiID = (id: string): boolean => {
  if (!id || id.length !== 13 || !/^\d+$/.test(id)) return false;

  let sum = 0;
  for (let i = 0; i < 12; i++) {
    sum += parseInt(id.charAt(i)) * (13 - i);
  }

  const checkDigit = (11 - (sum % 11)) % 10;
  return checkDigit === parseInt(id.charAt(12));
};

export const validatePhone = (phone: string): boolean => {
  // Simple check for 10 digits starting with 0
  return /^0\d{9}$/.test(phone.replace(/-/g, ''));
};

export const formatThaiID = (id: string): string => {
  if (!id) return '';
  return id.replace(/(\d{1})(\d{4})(\d{5})(\d{2})(\d{1})/, '$1-$2-$3-$4-$5');
};

export const maskThaiID = (id: string): string => {
  if (!id) return '';
  return id.substring(0, 3) + '-xxxx-xxxx-' + id.substring(11);
};