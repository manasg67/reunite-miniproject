import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bottom-0 bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('footer.about.title')}</h3>
            <p className="text-sm">{t('footer.about.description')}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('footer.quick_links.title')}</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm hover:text-white transition-colors">
                  {t('footer.quick_links.home')}
                </a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-white transition-colors">
                  {t('footer.quick_links.search')}
                </a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-white transition-colors">
                  {t('footer.quick_links.report')}
                </a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-white transition-colors">
                  {t('footer.quick_links.success_stories')}
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('footer.resources.title')}</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm hover:text-white transition-colors">
                  {t('footer.resources.faqs')}
                </a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-white transition-colors">
                  {t('footer.resources.privacy')}
                </a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-white transition-colors">
                  {t('footer.resources.terms')}
                </a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-white transition-colors">
                  {t('footer.resources.contact')}
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('footer.connect.title')}</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Facebook className="h-6 w-6" />
                <span className="sr-only">{t('footer.connect.social.facebook')}</span>
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Twitter className="h-6 w-6" />
                <span className="sr-only">{t('footer.connect.social.twitter')}</span>
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Instagram className="h-6 w-6" />
                <span className="sr-only">{t('footer.connect.social.instagram')}</span>
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Linkedin className="h-6 w-6" />
                <span className="sr-only">{t('footer.connect.social.linkedin')}</span>
              </a>
            </div>
            <div className="mt-4">
              <p className="text-sm">{t('footer.connect.newsletter.title')}</p>
              <form className="mt-2 flex">
                <input
                  type="email"
                  placeholder={t('footer.connect.newsletter.placeholder')}
                  className="flex-grow px-3 py-2 bg-gray-800 text-white rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {t('footer.connect.newsletter.button')}
                </button>
              </form>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700 text-center">
          <p className="text-sm">
            {t('footer.copyright', { year: 2025 })}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;