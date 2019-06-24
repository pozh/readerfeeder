import React from 'react';
import { Link } from 'react-router-dom';
import DocumentTitle from 'react-document-title';
import ScrollToTop from 'utils/ScrollToTop';
import Footer from './../components/Footer';
import Header from './../components/Header';
import PageCaption from './../components/PageCaption';


const TermsPage = () => {
  return (
    <DocumentTitle title="Terms of Service - ReaderFeeder">
      <div>
        <ScrollToTop/>
        <Header className="white" />
        <PageCaption>Terms of Service</PageCaption>
        <div className="container">
          <p>The following terms and conditions govern all use of the ReaderFeeder.co website and all content, services and
            products available at or through the website. The Website is owned and operated by Sergey Pozhilov, an
            individual online entrepreneur. (“the owner”). The Website is offered subject to your acceptance without
            modification of all of the terms and conditions contained herein and all other operating rules, policies
            (including, without limitation, ReaderFeeder.co’s <Link to="/privacy">Privacy Policy</Link>) and procedures
            that may be published from time to time on this Site by the owner (collectively, the “Agreement”).</p>

          <p>Please read this Agreement carefully before accessing or using the Website. By accessing or using any part of
            the web site, you agree to become bound by the terms and conditions of this agreement. If you do not agree to
            all the terms and conditions of this agreement, then you may not access the Website or use any services. If
            these terms and conditions are considered an offer by the owner, acceptance is expressly limited to these terms.
            The Website is available only to individuals who are at least 13 years old.</p>

          <ul className="list-simple">
            <li><strong>Your ReaderFeeder.co Account and Site.</strong> If you create an account on the Website, you are
              responsible for maintaining the security of your account, and you are fully responsible for all activities
              that occur under the account and any other actions taken in connection with it. You must immediately
              notify the owner of any unauthorized uses of your account or any other breaches of security. The owner will
              not be liable for any acts or omissions by You, including any damages of any kind incurred as a result of such
              acts or omissions.
            </li>
            <li><strong>Responsibility of Registered users.</strong> By submitting Content to ReaderFeeder, you grant
              the owner a world-wide, royalty-free, and non-exclusive license to store, modify, and adapt the Content solely
              for the purpose of processing and delivering it to your e-reader(s) or computer(s).<br/>
              Without limiting any of those representations or warranties, the owner has the right (though not the
              obligation) to, in the owner’s sole discretion (i) refuse or remove any content that, in the owner’s
              reasonable opinion, violates any ReaderFeeder policy or is in any way harmful or objectionable, or (ii)
              terminate or deny access to and use of the Website to any individual or entity for any reason, in the
              owner’s sole discretion. <b><br/>
              </b></li>
            <li><strong>Termination.</strong> The owner may terminate your access to all or any part of the Website at any
              time, with or without cause, with or without notice, effective immediately. If you wish to terminate this
              Agreement or your ReaderFeeder.co account (if you have one), you may simply discontinue using the
              Website.
            </li>
            <li><strong>Disclaimer of Warranties.</strong> The Website is provided “as is”. The owner and its suppliers and
              licensors hereby disclaim all warranties of any kind, express or implied, including, without limitation, the
              warranties of merchantability, fitness for a particular purpose and non-infringement. Neither the owner nor
              its suppliers and licensors, makes any warranty that the Website will be error free or that access thereto
              will be continuous or uninterrupted. If you’re actually reading this, here’s a treat. You understand that you
              download from, or otherwise obtain content or services through, the Website at your own discretion and risk.
            </li>
            <li><strong>Limitation of Liability.</strong> In no event will the owner, or its suppliers or licensors, be
              liable with respect to any subject matter of this agreement under any contract, negligence, strict liability
              or other legal or equitable theory for: (i) any special, incidental or consequential damages; (ii) the cost of
              procurement or substitute products or services; (iii) for interruption of use or loss or corruption of data.
              The owner shall have no liability for any failure or delay due to matters beyond his reasonable control. The
              foregoing shall not apply to the extent prohibited by applicable law.
            </li>
            <li><strong>General Representation and Warranty.</strong> You represent and warrant that (i) your use of the
              Website will be in strict accordance with the ReaderFeeder <Link to="/privacy">Privacy Policy</Link>, with
              this Agreement and with all applicable laws and regulations (including without limitation any local laws or
              regulations in your country, state, city, or other governmental area, regarding online conduct and acceptable
              content, and including all applicable laws regarding the transmission of technical data exported from the
              United States or the country in which you reside) and (ii) your use of the Website will not infringe or
              misappropriate the intellectual property rights of any third party.
            </li>
            <li><strong>Indemnification.</strong> You agree to indemnify and hold harmless the owner, his contractors, and
              his licensors, and their respective directors, officers, employees and agents from and against any and all
              claims and expenses, including attorneys’ fees, arising out of your use of the Website, including but not
              limited to your violation of this Agreement.
            </li>
            <li><strong>Miscellaneous.</strong> This Agreement constitutes the entire agreement between the owner and you
              concerning the subject matter hereof, and they may only be modified by a written amendment signed by the
              owner, or by the posting by the owner of a revised version. Except to the extent applicable law, if any,
              provides otherwise, this Agreement, any access to or use of the Website will be governed by the laws of
              Russia. If any part of this Agreement is held invalid or unenforceable, that part will be construed to reflect
              the parties’ original intent, and the remaining portions will remain in full force and effect. A waiver by
              either party of any term or condition of this Agreement or any breach thereof, in any one instance, will not
              waive such term or condition or any subsequent breach thereof. You may assign your rights under this Agreement
              to any party that consents to, and agrees to be bound by, its terms and conditions; the owner may assign his
              rights under this Agreement without condition. This Agreement will be binding upon and will inure to the
              benefit of the parties, their successors and permitted assigns.
            </li>
          </ul>
        </div>
        <hr className="mt-5"/>
        <Footer />
      </div>
    </DocumentTitle>


  );
};

export default TermsPage;
