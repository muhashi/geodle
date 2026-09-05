import {
  Anchor, Group, Paper, Stack, Text,
} from '@mantine/core';
import { ReactNode } from 'react';


export function Footer({
  onTerms,
  onPrivacy,
  onUpdates,
}: {
  onTerms: () => void;
  onPrivacy: () => void;
  onUpdates: () => void;
}) {
  return (
    <Group justify="center" gap="xs" mt="xl" pb="md">
      <Group gap="4">
        <Text size="sm" c="dimmed">
          by
        </Text>
        <Anchor href="https://muhashi.com/" target="_blank" size="sm" c="ink.6">
          muhashi
        </Anchor>
      </Group>
      <Text c="dimmed" size="sm">&middot;</Text>
      <Anchor component="button" type="button" size="sm" c="dimmed" onClick={onUpdates}>
        Updates
      </Anchor>
      <Text c="dimmed" size="sm">&middot;</Text>
      <Anchor component="button" type="button" size="sm" c="dimmed" onClick={onTerms}>
        Terms
      </Anchor>
      <Text c="dimmed" size="sm">&middot;</Text>
      <Anchor component="button" type="button" size="sm" c="dimmed" onClick={onPrivacy}>
        Privacy
      </Anchor>
    </Group>
  );
}

function StaticPage({ title, onBack, children }: { title: string; onBack: () => void; children: ReactNode }) {
  return (
    <Stack mx="auto" gap="md" py="xl" style={{ maxWidth: 640 }}>
      <Anchor component="button" type="button" size="sm" onClick={onBack} style={{ alignSelf: 'flex-start' }}>
        &larr; Back to home
      </Anchor>
      <Paper p="lg">
        <Stack gap="md">
          <Text fz="xl" fw={700}>{title}</Text>
          <Stack gap="sm">{children}</Stack>
        </Stack>
      </Paper>
    </Stack>
  );
}

export function TermsPage({ onBack }: { onBack: () => void }) {
  return (
    <StaticPage title="Terms of Service" onBack={onBack}>
      <Text size="sm" c="dimmed">
        Effective date: August 12, 2026
      </Text>
      <Text>
        By accessing or using Geodle (the &quot;Website&quot;), you agree to comply with and be bound by these Terms of Service. In these terms, &quot;Geodle,&quot; &quot;we,&quot; &quot;our,&quot; and &quot;us&quot; refer to the operator of the Website. If you do not agree to these terms, please refrain from using the Website.
      </Text>
      <Text size="lg" fw={700}>
        Eligibility
      </Text>
      <Text>
        The Website is not intended for children under 13, and we do not knowingly collect personal information from anyone under 13. By using the Website, you represent that you are at least 13 years old and that you are able to form a binding agreement under the laws applicable to you.
      </Text>
      <Text size="lg" fw={700}>
        Use of Content
      </Text>
      <Text>
        Content on the Website is dedicated to the public domain under the Creative Commons CC0 1.0 Universal license. You are free to copy, modify, distribute, and use the content, even for commercial purposes, without asking permission. This dedication does not extend to third-party trademarks, logos, or content that we do not own, which remain the property of their respective owners.
      </Text>
      <Text size="lg" fw={700}>
        Acceptable Use
      </Text>
      <Text component="div">
        You agree not to misuse the Website. In particular, you agree not to:
        <ul>
          <li>Attempt to gain unauthorized access to any part of the Website or our systems;</li>
          <li>Interfere with or disrupt the integrity or performance of the Website, including through automated scraping or cheating;</li>
          <li>Use the Website to violate any applicable law or the rights of others; or</li>
          <li>Use the Website in any way that is unlawful, harmful, or abusive toward other users.</li>
        </ul>
        We may investigate and take appropriate action against anyone who, in our sole discretion, violates these terms.
      </Text>
      <Text size="lg" fw={700}>
        Privacy Policy
      </Text>
      <Text>
        Your use of the Website is also governed by our Privacy Policy. By using the Website, you consent to the terms of the Privacy Policy.
      </Text>
      <Text size="lg" fw={700}>
        Cookies
      </Text>
      <Text>
        Geodle uses cookies to store your gameplay statistics, such as your streak and scores, directly on your device, and to help us understand how the Website is used via Google Analytics. For more detail on the cookies and tracking technologies we use, see our Privacy Policy.
      </Text>
      <Text size="lg" fw={700}>
        Third-Party Services
      </Text>
      <Text>
        The Website integrates with third-party services, including analytics (Google Analytics via Google Tag Manager) and engagement tools (Playlight). Your use of those services is governed by their own terms and privacy policies, and we are not responsible for the content, practices, or availability of any third-party service.
      </Text>
      <Text size="lg" fw={700}>
        Disclaimer of Warranty
      </Text>
      <Text>
        The Website is provided &quot;as is&quot; without any warranties, expressed or implied. Geodle makes no representations or warranties regarding the accuracy or completeness of the content on the Website.
      </Text>
      <Text size="lg" fw={700}>
        Limitation of Liability
      </Text>
      <Text>
        Geodle shall not be liable for any direct, indirect, incidental, consequential, or punitive damages arising out of your use or inability to use the Website.
      </Text>
      <Text size="lg" fw={700}>
        Termination
      </Text>
      <Text>
        We may suspend or restrict your access to the Website at any time, with or without notice, if we believe you have violated these terms or for any other reason at our discretion. Provisions that by their nature should survive termination, including content ownership, disclaimers, and limitations of liability, will continue to apply.
      </Text>
      <Text size="lg" fw={700}>
        Governing Law
      </Text>
      <Text>
        These terms are governed by and construed in accordance with applicable law, without regard to conflict-of-law principles. Any disputes arising from these terms or your use of the Website will be resolved in the courts of competent jurisdiction applicable to the operator.
      </Text>
      <Text size="lg" fw={700}>
        Changes to Terms
      </Text>
      <Text>
        Geodle reserves the right to modify these terms at any time. Changes will be posted here with an updated &quot;Last Updated&quot; date. Your continued use of the Website after any changes constitutes your acceptance of the new terms.
      </Text>
      <Text size="lg" fw={700}>
        Contact Us
      </Text>
      <Text>
        If you have any questions about these Terms of Service, please contact us at hello [at symbol] geodle [dot symbol] me
      </Text>
    </StaticPage>
  );
}

export function PrivacyPage({ onBack }: { onBack: () => void }) {
  return (
    <StaticPage title="Privacy Policy" onBack={onBack}>
      <Text size="sm" c="dimmed">
        Effective date: August 12, 2026
      </Text>
      <Text>
        At Geodle (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;), we prioritize your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you visit and use geodle.me (&quot;the Website&quot;). By using Geodle, you agree to the terms outlined in this Privacy Policy.
      </Text>
      <Text size="lg" fw={700}>
        Information Collected
      </Text>
      <Text component="div">
        Geodle does not require an account, login, or any payment to play. We do not collect names, email addresses, or other information you might use to sign up for a typical website. The only information we collect is:
        <ul>
          <li>Automatically Collected Information: Device information, IP address, browser type, operating system, and general usage data (such as pages viewed and session duration).</li>
          <li>Analytics Identifiers: Cookies and pseudonymous identifiers set by Google Tag Manager / Google Analytics to help us understand how the Website is used.</li>
          <li>Advertising Identifiers: Cookies and identifiers set by Google AdSense to serve and personalize ads. See &quot;Advertising&quot; below.</li>
          <li>Gameplay Data: We store your game statistics such as your streak, scores, and past results, in cookies on your own device so they persist between visits. This data stays local to your browser; we do not collect or store it on our servers.</li>
          <li>Engagement Identifiers: Cookies or identifiers set by Playlight (see &quot;Other Third-Party Services&quot; below) on game results pages.</li>
        </ul>
      </Text>
      <Text size="lg" fw={700}>
        How We Use Your Information
      </Text>
      <Text component="div">We use the collected data for the following purposes:
        <ul>
          <li>To provide and improve the Geodle game and its features.</li>
          <li>To analyze traffic and understand user behavior via Google Analytics (loaded through Google Tag Manager), including aggregated metrics on sessions, page views, and feature engagement.</li>
          <li>To identify and fix bugs or technical issues.</li>
        </ul>
      </Text>
      <Text size="lg" fw={700}>
        Sharing Your Information
      </Text>
      <Text component="div">
        We do not sell your personal information. The third parties that receive data about your visit are:
        <ul>
          <li>Google Analytics / Google Tag Manager, used for website analytics. Google&apos;s handling of this data is described at https://policies.google.com/technologies/partner-sites.</li>
          <li>Google AdSense, used to serve advertisements. Google uses cookies and advertising identifiers to serve personalized and non-personalized ads. Learn more at https://policies.google.com/technologies/ads and https://policies.google.com/privacy. You can manage personalized ads at https://adssettings.google.com.</li>
          <li>Playlight, an exit-intent engagement SDK loaded on game results pages that may recommend related sites you might enjoy. See &quot;Other Third-Party Services&quot; below for details.</li>
        </ul>
        We may also disclose information if required by law or to protect our rights, safety, or property.
      </Text>
      <Text size="lg" fw={700}>
        Data Storage and Security
      </Text>
      <Text>
        Your data is stored securely and protected against unauthorized access, alteration, or destruction. We use industry-standard security practices. However, no method of transmission over the Internet is entirely secure.
      </Text>
      <Text size="lg" fw={700}>
        Your Rights
      </Text>
      <Text>
        We respect your legal rights regarding the data we collect about you. As part of our operations, we share analytics, game and owner data with our third-party partners for processing purposes.
      </Text>
      <Text size="lg" fw={700}>
        Cookies and Tracking Technologies
      </Text>
      <Text component="div">
        We use cookies for a few different purposes:
        <ul>
          <li>Gameplay cookies: We use cookies to store your streak, scores, and past results directly on your device, so your progress carries over between visits. These stay on your device and are not sent to us.</li>
          <li>Analytics cookies: We use Google Tag Manager to load Google Analytics, which sets cookies and collects pseudonymous usage data (such as pages viewed and session duration) to help us understand how the Website is used.</li>
          <li>Advertising cookies: We use Google AdSense to serve ads. AdSense uses cookies, including the DoubleClick cookie, to serve personalized or non-personalized ads based on your visits to this and other sites. You can opt out of personalized advertising by visiting https://adssettings.google.com or https://www.aboutads.info/choices. See https://policies.google.com/technologies/ads for details.</li>
          <li>Engagement cookies: Playlight, loaded on game results pages, may set its own cookies or identifiers to recommend related sites. See https://playlight.dev/privacy for details.</li>
        </ul>
        You can control or disable cookies through your browser settings at any time. Disabling cookies may affect some features of the Website — including your saved streak and scores, which are stored only in cookies and will be lost if cookies are cleared.
      </Text>
      <Text size="lg" fw={700}>
        Advertising
      </Text>
      <Text component="div">
        We use Google AdSense to display advertisements on the Website. Key points:
        <ul>
          <li>Third-party vendors, including Google, use cookies to serve ads based on your prior visits to this and other websites.</li>
          <li>Google&apos;s use of advertising cookies enables it and its partners to serve ads based on your visit to this site and/or other sites.</li>
          <li>You may opt out of personalized advertising by visiting Ads Settings at https://adssettings.google.com.</li>
          <li>Non-personalized ads may still be shown using contextual information rather than past browsing behavior.</li>
          <li>For more information on how Google uses data, see https://policies.google.com/technologies/partner-sites.</li>
        </ul>
      </Text>
      <Text size="lg" fw={700}>
        Other Third-Party Services
      </Text>
      <Text component="div">
        <ul>
          <li>Playlight: We load the Playlight exit-intent engagement SDK on game results pages. Playlight may set cookies or identifiers to recommend related sites you might enjoy. See https://playlight.dev/privacy for details.</li>
        </ul>
      </Text>
      <Text size="lg" fw={700}>
        Children&apos;s Privacy
      </Text>
      <Text>
        Geodle is not intended for children under 13, and we do not knowingly collect their data. Contact us if you believe a child has provided information to us.
      </Text>
      <Text size="lg" fw={700}>
        Changes to This Privacy Policy
      </Text>
      <Text>
        We may update this Privacy Policy periodically. Changes will be posted here with an updated &quot;Effective Date&quot;. Please review this policy regularly.
      </Text>
      <Text size="lg" fw={700}>
        Contact Us
      </Text>
      <Text>
        If you have any questions or concerns about this Privacy Policy, please contact us at: hello [at symbol] geodle [dot symbol] me
      </Text>

    </StaticPage>
  );
}

export function UpdatesPage({ onBack }: { onBack: () => void }) {
  return (
    <StaticPage title="Updates" onBack={onBack}>
      <Text size="lg" fw={700}>
        Sep 1, 2026
      </Text>
      <Text>
        Launch of the new Geodle design! I hope you enjoy it :&#41;
      </Text>
      <Text>
        Please email me any feedback or bugs: hello [at symbol] geodle [dot symbol] me
      </Text>
    </StaticPage>
  );
}
