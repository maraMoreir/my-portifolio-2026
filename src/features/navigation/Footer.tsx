import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";

const FooterWrapper = styled.footer`
  background: rgba(5, 1, 15, 0.85);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-top: 1px solid rgba(123, 44, 255, 0.2);
  padding: ${({ theme }) => theme.spacing.xl} 0
    ${({ theme }) => theme.spacing.lg};
`;

const FooterInner = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.lg};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 0 ${({ theme }) => theme.spacing.md};
  }
`;

const FooterGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.xl};
  margin-bottom: ${({ theme }) => theme.spacing.xl};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing.lg};
  }
`;

const FooterSection = styled(motion.div)``;

const FooterTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: ${({ theme }) => theme.colors.glow};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const BrandName = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: 700;
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.text},
    ${({ theme }) => theme.colors.glow}
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const BrandTagline = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.6;
`;

const ContactList = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const ContactItem = styled.li``;

const ContactLink = styled.a`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  text-decoration: none;
  transition: color ${({ theme }) => theme.transition.fast};

  &:hover {
    color: ${({ theme }) => theme.colors.glow};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 4px;
    border-radius: ${({ theme }) => theme.radius.sm};
  }
`;

const IconWrapper = styled.span`
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const NavList = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const NavItem = styled.li``;

const NavLink = styled.a`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  text-decoration: none;
  transition: color ${({ theme }) => theme.transition.fast};
  padding: 2px 0;
  display: inline-block;

  &:hover {
    color: ${({ theme }) => theme.colors.glow};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 4px;
    border-radius: ${({ theme }) => theme.radius.sm};
  }
`;

const Divider = styled.div`
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(123, 44, 255, 0.4),
    transparent
  );
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const FooterBottom = styled.div`
  text-align: center;
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.6;
`;

const NAV_LINKS = [
  { label: "Início", href: "#hero" },
  { label: "Tecnologias", href: "#technologies" },
  { label: "Engenharia", href: "#engineering" },
  { label: "Blog", href: "#blog" },
];

const handleNavClick = (
  e: React.MouseEvent<HTMLAnchorElement>,
  href: string,
) => {
  e.preventDefault();
  const id = href.replace("#", "");
  const target = document.getElementById(id);
  if (target) {
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export const Footer: React.FC = () => {
  return (
    <FooterWrapper id="footer" aria-label="Rodapé">
      <FooterInner>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          <FooterGrid>
            {/* Brand */}
            <FooterSection variants={itemVariants}>
              <BrandName>Silmara M.</BrandName>
              <BrandTagline>Desenvolvedora de Software</BrandTagline>
            </FooterSection>

            {/* Contact */}
            <FooterSection variants={itemVariants}>
              <FooterTitle>Contato</FooterTitle>
              <ContactList>
                <ContactItem></ContactItem>
                <ContactItem>
                  <ContactLink
                    href="https://www.linkedin.com/in/silmaraa/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Perfil do LinkedIn de Mara Moreira (abre em nova aba)"
                  >
                    <IconWrapper aria-hidden="true">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                        <rect x="2" y="9" width="4" height="12" />
                        <circle cx="4" cy="4" r="2" />
                      </svg>
                    </IconWrapper>
                    LinkedIn
                  </ContactLink>
                </ContactItem>
                <ContactItem>
                  <ContactLink
                    href="https://github.com/maraMoreir"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Perfil do GitHub de Mara Moreira (abre em nova aba)"
                  >
                    <IconWrapper aria-hidden="true">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                      </svg>
                    </IconWrapper>
                    GitHub
                  </ContactLink>
                </ContactItem>
              </ContactList>
            </FooterSection>

            {/* Quick Navigation */}
            <FooterSection variants={itemVariants}>
              <FooterTitle>Navegação</FooterTitle>
              <NavList>
                {NAV_LINKS.map((link) => (
                  <NavItem key={link.href}>
                    <NavLink
                      href={link.href}
                      onClick={(e) => handleNavClick(e, link.href)}
                    >
                      {link.label}
                    </NavLink>
                  </NavItem>
                ))}
              </NavList>
            </FooterSection>
          </FooterGrid>
        </motion.div>

        <Divider />

        <FooterBottom>
          © 2026 Silmara M. - Construído com React / TypeScript &amp; muito amor
          ❤️
        </FooterBottom>
      </FooterInner>
    </FooterWrapper>
  );
};
