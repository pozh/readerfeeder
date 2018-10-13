import React from 'react';
import DocumentTitle from 'react-document-title';
import ScrollToTop from 'utils/ScrollToTop';
import Footer from './../components/Footer';
import Header from './../components/Header';
import PageCaption from './../components/PageCaption';


const PrivacyPage = () => {
  return (
    <DocumentTitle title="Terms of Service - ReaderFeeder">
      <div>
        <ScrollToTop/>
        <Header className="white"/>
        <PageCaption>Privacy Policy</PageCaption>
        <div className="container">
          <p><strong>Who’s behind the website?</strong><br/>
            ReaderFeeder.co is a personal project by Sergey Pozhilov, an online entrepreneur and web developer.
            For simplicity now and in the future, the plural pronouns “we”, “our”, and “us” are used in this document.</p>
          <p><strong>What information do we collect?</strong></p>
          <ul className="list-simple">
            <li>We collect information from you when you register on our site. When registering on our site, as
              appropriate, you may be asked to enter your e-mail address. You may, however, visit our site anonymously.
            </li>
            <li>The pages you’ve sent to your e-reader using our site. This data is used only by the application itself,
              and only to operate the list of those pages on your user page and in Composer where you can edit them.
            </li>
            <li>.Mobi files produced during sending content to your e-reader. Those files are stored in order to make
              you able to download your deliveries later or to share them with your friends.</li>
            <li>With the help of Google Analytics we keep track of our site’s pages popularity.</li>
          </ul>

          <p><strong>What do we use your information for?</strong></p>
          <p>Any of the information we collect from you may be used in one of the following ways:</p>
          <ul className="list-simple">
            <li>To improve our website (we continually strive to improve our website functionality based on the
              information and feedback we receive from you)
            </li>
            <li>To process your requests</li>
          </ul>
          <blockquote><p>Your information, whether public or private, will not be sold, exchanged, transferred, or given
            to any other company for any reason whatsoever, without your consent, other than for the express purpose of
            delivering the purchased product or service requested.</p></blockquote>
          <p>
            <strong>How do we protect your information?</strong></p>
          <p>We implement a variety of security measures to maintain the safety of your personal information when you
            enter, submit, or access your personal information.</p>
          <p><strong>Information about your purchases</strong></p>
          <p>All your purchases at this site are handled by Paddle – our payment processing partner. It uses the
            highest level of encryption throughout the entire order and setup processes, from all order pages, through
            the storage of customer information, and credit card processing. For Paddle privacy policy please refer to <a
              href="https://paddle.com/privacy/" target="_blank" rel="nofollow">Paddle website</a>.
          </p>
          <p><strong>Do we use cookies?</strong></p>
          <p>Yes (Cookies are small files that a site or its service provider transfers to your computers hard drive
            through your Web browser (if you allow) that enables the sites or service providers systems to recognize
            your browser and capture and remember certain information</p>
          <p>We use cookies to compile aggregate data about site traffic and site interaction so that we can offer
            better site experiences and tools in the future.</p>
          <p><strong>Do we disclose any information to outside parties?</strong></p>
          <p>We do not sell, trade, or otherwise transfer to outside parties your personally identifiable information.
            This does not include trusted third parties who assist us in operating our website, conducting our business,
            or servicing you, so long as those parties agree to keep this information confidential. We may also release
            your information when we believe release is appropriate to comply with the law, enforce our site policies,
            or protect ours or others rights, property, or safety. </p>
          <p><strong>Online Privacy Policy Only</strong></p>
          <p>This online privacy policy applies only to information collected through our website and not to information
            collected offline.</p>
          <p><strong>Your Consent</strong></p>
          <p>By using our site, you consent to our websites privacy policy.</p>
          <p><strong>Changes to our Privacy Policy</strong></p>
          <p>If we decide to change our privacy policy, we will post those changes on this page. </p>
          <p><strong>Contacting Us</strong></p>
          <p>If there are any questions regarding this privacy policy you may contact us using this email address:
            hello@readerfeeder.co</p>
        </div>

        <hr className="mt-5"/>
        <Footer/>
      </div>
    </DocumentTitle>
  );
};

export default PrivacyPage;
