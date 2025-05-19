// src/app/components/themes/dimension/DimensionTheme.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import './dimension.css';

interface NavItem {
  id: string;
  label: string;
  slug: string;
}

interface DimensionThemeProps {
  page: any;
  tenant: string;
  locale: string;
  navigation: NavItem[];
}

export const DimensionTheme: React.FC<DimensionThemeProps> = ({ 
  page, 
  tenant, 
  locale,
  navigation = []
}) => {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  
  // Default sections if no navigation is provided
  const navItems = navigation.length > 0 ? navigation : [
    { id: 'intro', label: 'Intro', slug: 'intro' },
    { id: 'work', label: 'Work', slug: 'work' },
    { id: 'about', label: 'About', slug: 'about' },
    { id: 'contact', label: 'Contact', slug: 'contact' }
  ];
  
  return (
    <div className="dimension-theme">
      {/* Header */}
      <header id="header">
        <div className="content">
          <div className="inner">
            <h1>{page.title || tenant}</h1>
            <p>{page.subtitle || 'Welcome to our website'}</p>
          </div>
        </div>
        <nav>
          <ul>
            {navItems.map(item => (
              <li key={item.id}>
                <button onClick={() => setActiveSection(item.id)}>
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </header>
      
      {/* Main Content */}
      <div id="main" style={{ display: activeSection ? 'block' : 'none' }}>
        {activeSection === 'intro' && (
          <article id="intro">
            <h2>Intro</h2>
            <div dangerouslySetInnerHTML={{ __html: page.introContent || page.content || '' }} />
            <button className="close" onClick={() => setActiveSection(null)}>Close</button>
          </article>
        )}
        
        {activeSection === 'work' && (
          <article id="work">
            <h2>Work</h2>
            <div dangerouslySetInnerHTML={{ __html: page.workContent || page.content || '' }} />
            <button className="close" onClick={() => setActiveSection(null)}>Close</button>
          </article>
        )}
        
        {activeSection === 'about' && (
          <article id="about">
            <h2>About</h2>
            <div dangerouslySetInnerHTML={{ __html: page.aboutContent || page.content || '' }} />
            <button className="close" onClick={() => setActiveSection(null)}>Close</button>
          </article>
        )}
        
        {activeSection === 'contact' && (
          <article id="contact">
            <h2>Contact</h2>
            <form method="post" action="#">
              <div className="fields">
                <div className="field half">
                  <label htmlFor="name">Name</label>
                  <input type="text" name="name" id="name" />
                </div>
                <div className="field half">
                  <label htmlFor="email">Email</label>
                  <input type="text" name="email" id="email" />
                </div>
                <div className="field">
                  <label htmlFor="message">Message</label>
                  <textarea name="message" id="message" rows={4}></textarea>
                </div>
              </div>
              <button type="submit">Send Message</button>
            </form>
            <button className="close" onClick={() => setActiveSection(null)}>Close</button>
          </article>
        )}
      </div>
      
      {/* Footer */}
      <footer id="footer">
        <p>&copy; {tenant} {new Date().getFullYear()}. Built with PayloadCMS and Next.js.</p>
      </footer>
      
      {/* Background */}
      <div id="bg"></div>
    </div>
  );
};