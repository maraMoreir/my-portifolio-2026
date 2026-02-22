import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";

interface NavLink {
  label: string;
  href: string;
}

const NAV_LINKS: NavLink[] = [
  { label: "Início", href: "#hero" },
  { label: "Tecnologias", href: "#technologies" },
  { label: "Blog", href: "#blog" },
  { label: "Contato", href: "#footer" },
];

const SECTION_IDS = ["hero", "about", "technologies", "blog", "footer"];

const HeaderWrapper = styled(motion.header)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: rgba(5, 1, 15, 0.75);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid rgba(123, 44, 255, 0.15);
`;

const HeaderInner = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.lg};
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 0 ${({ theme }) => theme.spacing.md};
  }
`;

const Logo = styled.a`
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
  text-decoration: none;
  letter-spacing: 0.02em;
  flex-shrink: 0;

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 4px;
    border-radius: ${({ theme }) => theme.radius.sm};
  }
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: none;
  }
`;

const NavItem = styled.a<{ $active?: boolean }>`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: 500;
  color: ${({ $active, theme }) =>
    $active ? theme.colors.glow : theme.colors.textSecondary};
  text-decoration: none;
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.radius.sm};
  transition:
    color ${({ theme }) => theme.transition.fast},
    background ${({ theme }) => theme.transition.fast};
  position: relative;

  &::after {
    content: "";
    position: absolute;
    bottom: -2px;
    left: 50%;
    transform: translateX(-50%);
    width: ${({ $active }) => ($active ? "100%" : "0")};
    height: 2px;
    background: ${({ theme }) => theme.colors.primary};
    border-radius: 1px;
    transition: width ${({ theme }) => theme.transition.fast};
  }

  &:hover {
    color: ${({ theme }) => theme.colors.text};
    background: rgba(123, 44, 255, 0.1);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 4px;
  }
`;

const HamburgerButton = styled.button`
  display: none;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: ${({ theme }) => theme.radius.sm};
  color: ${({ theme }) => theme.colors.text};
  transition: background ${({ theme }) => theme.transition.fast};

  &:hover {
    background: rgba(123, 44, 255, 0.1);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: flex;
  }
`;

const Bar = styled.span<{ $open: boolean; $index: number }>`
  display: block;
  width: 22px;
  height: 2px;
  background: ${({ theme }) => theme.colors.text};
  border-radius: 2px;
  transition:
    transform 0.3s ease,
    opacity 0.3s ease;

  ${({ $open, $index }) =>
    $open &&
    $index === 0 &&
    `
    transform: translateY(7px) rotate(45deg);
  `}

  ${({ $open, $index }) =>
    $open &&
    $index === 1 &&
    `
    opacity: 0;
  `}

  ${({ $open, $index }) =>
    $open &&
    $index === 2 &&
    `
    transform: translateY(-7px) rotate(-45deg);
  `}
`;

const MobileMenu = styled(motion.div)`
  position: fixed;
  top: 64px;
  left: 0;
  right: 0;
  background: rgba(5, 1, 15, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(123, 44, 255, 0.15);
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  z-index: 999;
`;

const MobileNavItem = styled.a<{ $active?: boolean }>`
  font-size: ${({ theme }) => theme.fontSizes.md};
  font-weight: 500;
  color: ${({ $active, theme }) =>
    $active ? theme.colors.glow : theme.colors.textSecondary};
  text-decoration: none;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radius.sm};
  transition:
    color ${({ theme }) => theme.transition.fast},
    background ${({ theme }) => theme.transition.fast};
  background: ${({ $active }) =>
    $active ? "rgba(123, 44, 255, 0.15)" : "transparent"};

  &:hover {
    color: ${({ theme }) => theme.colors.text};
    background: rgba(123, 44, 255, 0.1);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`;

const handleNavClick = (
  e: React.MouseEvent<HTMLAnchorElement>,
  href: string,
  onClose?: () => void,
) => {
  e.preventDefault();
  const id = href.replace("#", "");
  const target = document.getElementById(id);
  if (target) {
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  onClose?.();
};

export const Header: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>("hero");
  const [menuOpen, setMenuOpen] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const sectionMap = new Map<Element, string>();

    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) sectionMap.set(el, id);
    });

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible.length > 0) {
          const id = sectionMap.get(visible[0].target);
          if (id) setActiveSection(id);
        }
      },
      { threshold: 0.3, rootMargin: "-64px 0px 0px 0px" },
    );

    sectionMap.forEach((_, el) => observerRef.current?.observe(el));

    return () => observerRef.current?.disconnect();
  }, []);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) setMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <HeaderWrapper
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        role="banner"
      >
        <HeaderInner>
          <Logo
            href="#hero"
            aria-label="Ir para o início"
            onClick={(e) => handleNavClick(e, "#hero")}
          >
            Silmara M.
          </Logo>

          <Nav aria-label="Navegação principal">
            {NAV_LINKS.map((link) => {
              const id = link.href.replace("#", "");
              return (
                <NavItem
                  key={link.href}
                  href={link.href}
                  $active={activeSection === id}
                  aria-current={activeSection === id ? "page" : undefined}
                  onClick={(e) => handleNavClick(e, link.href)}
                >
                  {link.label}
                </NavItem>
              );
            })}
          </Nav>

          <HamburgerButton
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            <Bar $open={menuOpen} $index={0} />
            <Bar $open={menuOpen} $index={1} />
            <Bar $open={menuOpen} $index={2} />
          </HamburgerButton>
        </HeaderInner>
      </HeaderWrapper>

      <AnimatePresence>
        {menuOpen && (
          <MobileMenu
            id="mobile-menu"
            role="navigation"
            aria-label="Menu mobile"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {NAV_LINKS.map((link) => {
              const id = link.href.replace("#", "");
              return (
                <MobileNavItem
                  key={link.href}
                  href={link.href}
                  $active={activeSection === id}
                  aria-current={activeSection === id ? "page" : undefined}
                  onClick={(e) =>
                    handleNavClick(e, link.href, () => setMenuOpen(false))
                  }
                >
                  {link.label}
                </MobileNavItem>
              );
            })}
          </MobileMenu>
        )}
      </AnimatePresence>
    </>
  );
};
