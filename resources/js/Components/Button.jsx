import React from 'react';

/**
 * Reusable Button component dengan inline styles yang eksplisit
 * Memastikan semua button terlihat jelas dan konsisten
 */

export function PrimaryButton({ children, onClick, href, type = 'button', disabled = false, className = '' }) {
    const style = {
        display: 'inline-block',
        padding: '12px 24px',
        backgroundColor: '#ea580c',
        color: '#ffffff',
        borderRadius: '8px',
        fontWeight: 'bold',
        fontSize: '16px',
        border: 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        textDecoration: 'none',
        transition: 'background-color 0.3s',
        opacity: disabled ? 0.6 : 1,
    };

    if (href) {
        return (
            <a
                href={href}
                style={style}
                onMouseEnter={(e) => !disabled && (e.target.style.backgroundColor = '#c2410c')}
                onMouseLeave={(e) => !disabled && (e.target.style.backgroundColor = '#ea580c')}
                className={className}
            >
                {children}
            </a>
        );
    }

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            style={style}
            onMouseEnter={(e) => !disabled && (e.target.style.backgroundColor = '#c2410c')}
            onMouseLeave={(e) => !disabled && (e.target.style.backgroundColor = '#ea580c')}
            className={className}
        >
            {children}
        </button>
    );
}

export function SecondaryButton({ children, onClick, href, type = 'button', disabled = false, className = '' }) {
    const style = {
        display: 'inline-block',
        padding: '12px 24px',
        backgroundColor: '#ffffff',
        color: '#ea580c',
        borderRadius: '8px',
        fontWeight: 'bold',
        fontSize: '16px',
        border: '2px solid #ea580c',
        cursor: disabled ? 'not-allowed' : 'pointer',
        textDecoration: 'none',
        transition: 'background-color 0.3s',
        opacity: disabled ? 0.6 : 1,
    };

    if (href) {
        return (
            <a
                href={href}
                style={style}
                onMouseEnter={(e) => !disabled && (e.target.style.backgroundColor = '#fff7ed')}
                onMouseLeave={(e) => !disabled && (e.target.style.backgroundColor = '#ffffff')}
                className={className}
            >
                {children}
            </a>
        );
    }

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            style={style}
            onMouseEnter={(e) => !disabled && (e.target.style.backgroundColor = '#fff7ed')}
            onMouseLeave={(e) => !disabled && (e.target.style.backgroundColor = '#ffffff')}
            className={className}
        >
            {children}
        </button>
    );
}

export function OutlineButton({ children, onClick, href, type = 'button', disabled = false, className = '' }) {
    const style = {
        display: 'inline-block',
        padding: '12px 24px',
        backgroundColor: 'transparent',
        color: '#ea580c',
        borderRadius: '8px',
        fontWeight: 'bold',
        fontSize: '16px',
        border: '2px solid #ea580c',
        cursor: disabled ? 'not-allowed' : 'pointer',
        textDecoration: 'none',
        transition: 'all 0.3s',
        opacity: disabled ? 0.6 : 1,
    };

    if (href) {
        return (
            <a
                href={href}
                style={style}
                onMouseEnter={(e) => !disabled && (e.target.style.backgroundColor = '#fff7ed')}
                onMouseLeave={(e) => !disabled && (e.target.style.backgroundColor = 'transparent')}
                className={className}
            >
                {children}
            </a>
        );
    }

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            style={style}
            onMouseEnter={(e) => !disabled && (e.target.style.backgroundColor = '#fff7ed')}
            onMouseLeave={(e) => !disabled && (e.target.style.backgroundColor = 'transparent')}
            className={className}
        >
            {children}
        </button>
    );
}
