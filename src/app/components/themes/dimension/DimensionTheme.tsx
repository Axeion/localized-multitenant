// src/app/components/themes/dimension/DimensionTheme.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// Import your styles (create this file next)
import './dimension.css';

// TypeScript interfaces for props
interface NavItem {
  id: string;
  label: string;
  slug: string;
}

interface DimensionThemeProps {
  page: any; // You can make this more specific based on your page structure
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
  // State for managing which modal is open
  const [isArticleVisible, setIsArticleVisible] = useState(false);
  const [timeout, setTimeout] = useState(false);
  const [articleTimeout, setArticleTimeout] = useState(false);
  const [article, setArticle] = useState('');
  const [loading, setLoading] = useState('is-loading');

  // Effect for initial loading animation
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setLoading('');
    }, 100);
    return () => window.clearTimeout(timer);
  }, []);

  // Handle opening a modal
  const handleOpenArticle = (article: string) => {
    setIsArticleVisible(!isArticleVisible);
    setArticle(article);

    window.setTimeout(() => {
      setTimeout(true);
    }, 325);

    window.setTimeout(() => {
      setArticleTimeout(true);
    }, 350);
  };

  // Handle closing a modal
  const handleCloseArticle = () => {
    setArticleTimeout(false);

    window.setTimeout(() => {
      setTimeout(false);
    }, 325);

    window.setTimeout(() => {
      setIsArticleVisible(false);
      setArticle('');
    }, 350);
  };

  // Determine which sections to include based on page data
  const getNavItems = () => {
    if (navigation && navigation.length > 0) {
      return navigation;
    }
    
    // Default sections if no navigation is provided
    return [
      { id: 'intro', label: 'Intro', slug: 'intro' },
      { id: 'work', label: 'Work', slug: 'work' },
      { id: 'about', label: 'About', slug: 'about' },
      { id: 'contact', label: 'Contact', slug: 'contact' }
    ];
  };

  // Generate article content based on the active article
  const getArticleContent = (articleId: string) => {
    // You could fetch this from the page content in Payload
    switch (articleId) {
      case 'intro':
        return (
          <>
            <h2 className="major">Intro</h2>
            <span className="image main">
              <img src="/images/pic01.jpg" alt="" />
            </span>
            <div dangerouslySetInnerHTML={{ __html: page.introContent || page.content || '' }} />
          </>
        );
      case 'work':
        return (
          <>
            <h2 className="major">Work</h2>
            <span className="image main">
              <img src="/images/pic02.jpg" alt="" />
            </span>
            <div dangerouslySetInnerHTML={{ __html: page.workContent || page.content || '' }} />
          </>
        );
      case 'about':
        return (
          <>
            <h2 className="major">About</h2>
            <span className="image main">
              <img src="/images/pic03.jpg" alt="" />
            </span>
            <div dangerouslySetInnerHTML={{ __html: page.aboutContent || page.content || '' }} />
          </>
        );
      case 'contact':
        return (
          <>
            <h2 className="major">Contact</h2>
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
              <ul className="actions">
                <li>
                  <input type="submit" value="Send Message" className="primary" />
                </li>
                <li>
                  <input type="reset" value="Reset" />
                </li>
              </ul>
            </form>
            <ul className="icons">
              <li>
                <a href="#" className="icon fa-twitter">
                  <span className="label">Twitter</span>
                </a>
              </li>
              <li>
                <a href="#" className="icon fa-facebook">
                  <span className="label">Facebook</span>
                </a>
              </li>
              <li>
                <a href="#" className="icon fa-instagram">
                  <span className="label">Instagram</span>
                </a>
              </li>
              <li>
                <a href="#" className="icon fa-github">
                  <span className="label">GitHub</span>
                </a>
              </li>
            </ul>
          </>
        );
      default:
        return <p>Content not found</p>;
    }
  };

  const navItems = getNavItems();

  return (
    <><div className={`body ${loading} ${isArticleVisible ? 'is-article-visible' : ''}`}>
          <div id="wrapper">
              <header id="header">
                  <div className="logo">
                      <span className="icon fa-diamond"></span>
                  </div>
                  <div className="content">
                      <div className="inner">
                          <h1>{page.title || tenant}</h1>
                          <p>{page.subtitle || 'A fully responsive site template designed by HTML5 UP and released for free under the Creative Commons license.'}</p>
                      </div>
                  </div>
                  <nav>
                      <ul>
                          {navItems.map((item) => (
                              <li key={item.id}>

                                  href="javascript:;"
                                  onClick={() => handleOpenArticle(item.id)}
                                  >
                                  {item.label}
                              </a>))}
                      </li>
                      ))}
                  </ul>
              </nav>
          </header>
          

          <main id="main" style={{ display: isArticleVisible ? 'flex' : 'none' }}>
              <article
                  id={article}
                  className={`${articleTimeout ? 'timeout' : ''} ${article ? 'active' : ''} ${timeout ? 'is-timeout' : ''}`}
                  style={{ display: article ? 'block' : 'none' }}
              >
                  {getArticleContent(article)}
                  <div className="close" onClick={handleCloseArticle}></div>
              </article>
          </main>

          <footer id="footer">
              <p className="copyright">
                  &copy; {tenant} - {new Date().getFullYear()}. Design:{' '}
                  <a href="https://html5up.net">HTML5 UP</a>. Built with: PayloadCMS + Next.js
              </p>
          </footer>
      </div><div id="bg"></div></>
    </div>
  );
};