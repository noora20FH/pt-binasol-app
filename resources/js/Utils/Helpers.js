/**
 * Utility Functions for PT Bina Auto Solusi
 * Common helper functions for formatting, validation, and data manipulation
 */

// ==================== Number Formatting ====================

/**
 * Format number as Indonesian Rupiah
 * @param {number} amount - Amount to format
 * @returns {string} Formatted Rupiah string
 */
export const formatRupiah = (amount) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(amount);
};

/**
 * Format indonesian currency display (simplified)
 * @param {number} amount
 * @returns {string} "Rp 1.000.000"
 */
export const formatCurrency = (amount) => {
    return `Rp ${new Intl.NumberFormat('id-ID').format(Math.round(amount))}`;
};

// ==================== Date Formatting ====================

/**
 * Format date to Indonesian locale
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date
 */
export const formatDate = (date) => {
    return new Intl.DateTimeFormat('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }).format(new Date(date));
};

/**
 * Format date with time
 * @param {string|Date} date
 * @returns {string} "15 Maret 2024 14:30"
 */
export const formatDateTime = (date) => {
    return new Intl.DateTimeFormat('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(new Date(date));
};

// ==================== String Utilities ====================

/**
 * Slugify a string
 * @param {string} text - Text to slugify
 * @returns {string} Slugified text
 */
export const slugify = (text) => {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_]+/g, '-')
        .replace(/^-+|-+$/g, '');
};

/**
 * Truncate text to specified length
 * @param {string} text - Text to truncate
 * @param {number} length - Max length
 * @param {string} suffix - Suffix (default: "...")
 * @returns {string} Truncated text
 */
export const truncate = (text, length = 100, suffix = '...') => {
    if (text.length <= length) return text;
    return text.substring(0, length).trim() + suffix;
};

/**
 * Capitalize first letter
 * @param {string} text
 * @returns {string}
 */
export const capitalize = (text) => {
    return text.charAt(0).toUpperCase() + text.slice(1);
};

// ==================== Validation ====================

/**
 * Validate email format
 * @param {string} email
 * @returns {boolean}
 */
export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Validate phone number (Indonesian format)
 * @param {string} phone
 * @returns {boolean}
 */
export const validatePhone = (phone) => {
    const phoneRegex = /^(\+62|62|0)[0-9]{9,12}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
};

/**
 * Validate URL
 * @param {string} url
 * @returns {boolean}
 */
export const validateUrl = (url) => {
    try {
        new URL(url);
        return true;
    } catch (e) {
        return false;
    }
};

// ==================== Array & Object Utilities ====================

/**
 * Group array items by key
 * @param {Array} array - Array to group
 * @param {string} key - Key to group by
 * @returns {Object} Grouped object
 */
export const groupBy = (array, key) => {
    return array.reduce((result, item) => {
        const group = item[key];
        if (!result[group]) result[group] = [];
        result[group].push(item);
        return result;
    }, {});
};

/**
 * Sort array of objects
 * @param {Array} array - Array to sort
 * @param {string} key - Key to sort by
 * @param {string} order - 'asc' or 'desc'
 * @returns {Array} Sorted array
 */
export const sortBy = (array, key, order = 'asc') => {
    return [...array].sort((a, b) => {
        if (a[key] < b[key]) return order === 'asc' ? -1 : 1;
        if (a[key] > b[key]) return order === 'asc' ? 1 : -1;
        return 0;
    });
};

/**
 * Deep clone an object
 * @param {Object} obj
 * @returns {Object}
 */
export const deepClone = (obj) => {
    return JSON.parse(JSON.stringify(obj));
};

// ==================== Price & Discount Utilities ====================

/**
 * Calculate discount percentage
 * @param {number} originalPrice
 * @param {number} discountedPrice
 * @returns {number} Discount percentage
 */
export const calculateDiscount = (originalPrice, discountedPrice) => {
    if (originalPrice === 0) return 0;
    return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
};

/**
 * Calculate price after discount
 * @param {number} price
 * @param {number} discountPercent
 * @returns {number} Price after discount
 */
export const applyDiscount = (price, discountPercent) => {
    return price - (price * discountPercent) / 100;
};

/**
 * Calculate tax (PPN 11%)
 * @param {number} price
 * @returns {number} Tax amount
 */
export const calculateTax = (price) => {
    return (price * 11) / 100;
};

// ==================== Local Storage Utilities ====================

/**
 * Get item from localStorage
 * @param {string} key
 * @param {*} defaultValue
 * @returns {*}
 */
export const getFromLocalStorage = (key, defaultValue = null) => {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
        return defaultValue;
    }
};

/**
 * Save item to localStorage
 * @param {string} key
 * @param {*} value
 */
export const saveToLocalStorage = (key, value) => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
        console.error('Error saving to localStorage', e);
    }
};

/**
 * Remove item from localStorage
 * @param {string} key
 */
export const removeFromLocalStorage = (key) => {
    localStorage.removeItem(key);
};

// ==================== Page Performance ====================

/**
 * Debounce function
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in ms
 * @returns {Function}
 */
export const debounce = (func, delay = 300) => {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
    };
};

/**
 * Throttle function
 * @param {Function} func - Function to throttle
 * @param {number} limit - Limit in ms
 * @returns {Function}
 */
export const throttle = (func, limit = 300) => {
    let inThrottle;
    return (...args) => {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
};

// ==================== Error Handling ====================

/**
 * Get error message from response
 * @param {Object} error - Error object
 * @returns {string} Error message
 */
export const getErrorMessage = (error) => {
    if (error.response?.data?.message) {
        return error.response.data.message;
    }
    if (error.message) {
        return error.message;
    }
    return 'Terjadi kesalahan. Silakan coba lagi.';
};

/**
 * Format validation errors from Laravel
 * @param {Object} errors - Laravel validation errors
 * @returns {Array} Array of error messages
 */
export const formatValidationErrors = (errors) => {
    const messages = [];
    Object.keys(errors).forEach((field) => {
        if (Array.isArray(errors[field])) {
            messages.push(...errors[field]);
        } else {
            messages.push(errors[field]);
        }
    });
    return messages;
};

// ==================== Image Utilities ====================

/**
 * Generate image URL with size
 * @param {string} imagePath - Image path
 * @param {number} width - Image width
 * @param {number} height - Image height
 * @returns {string} Image URL
 */
export const getImageUrl = (imagePath, width = null, height = null) => {
    if (!imagePath) return '/placeholder.jpg';
    
    const baseUrl = window.location.origin;
    let url = `${baseUrl}/storage/${imagePath}`;
    
    if (width && height) {
        url += `?w=${width}&h=${height}`;
    }
    
    return url;
};

/**
 * Check if image URL is valid
 * @param {string} url
 * @returns {Promise<boolean>}
 */
export const isValidImageUrl = async (url) => {
    try {
        const response = await fetch(url, { method: 'HEAD' });
        return response.ok;
    } catch {
        return false;
    }
};

// ==================== Pagination Utilities ====================

/**
 * Generate pagination links
 * @param {number} total - Total items
 * @param {number} perPage - Items per page
 * @param {number} currentPage - Current page
 * @returns {Array} Pagination data
 */
export const generatePagination = (total, perPage = 15, currentPage = 1) => {
    const lastPage = Math.ceil(total / perPage);
    const prevPage = currentPage > 1 ? currentPage - 1 : null;
    const nextPage = currentPage < lastPage ? currentPage + 1 : null;

    return {
        total,
        perPage,
        currentPage,
        lastPage,
        prevPage,
        nextPage,
        hasMore: nextPage !== null,
    };
};

// ==================== Export All ====================
export default {
    formatRupiah,
    formatCurrency,
    formatDate,
    formatDateTime,
    slugify,
    truncate,
    capitalize,
    validateEmail,
    validatePhone,
    validateUrl,
    groupBy,
    sortBy,
    deepClone,
    calculateDiscount,
    applyDiscount,
    calculateTax,
    getFromLocalStorage,
    saveToLocalStorage,
    removeFromLocalStorage,
    debounce,
    throttle,
    getErrorMessage,
    formatValidationErrors,
    getImageUrl,
    isValidImageUrl,
    generatePagination,
};
