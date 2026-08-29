import { motion } from "framer-motion";
import { useRef, useState, MouseEvent, useEffect } from "react";
import * as THREE from "three";

const SERVICES = [
  {
    icon: "⚡",
    title: "Web & App Development",
    desc: "Full-stack React, Vue, or Next.js frontends paired with robust backend systems. Cloud-native, scalable, and built for growth.",
    color: "#6366f1",
  },
  {
    icon: "☁",
    title: "Cloud & Infrastructure",
    desc: "AWS, GCP, and Azure expertise. We design, migrate, and optimize your cloud architecture for performance and cost efficiency.",
    color: "#10b981",
  },
  {
    icon: "🤖",
    title: "AI & Automation",
    desc: "Custom ML pipelines, LLM integrations, and intelligent automation. From prototypes to production-grade AI systems.",
    color: "#f59e0b",
  },
  {
    icon: "📊",
    title: "Data Engineering",
    desc: "ETL pipelines, data warehouses, and analytics platforms. We turn raw data into competitive intelligence.",
    color: "#ec4899",
  },
  {
    icon: "🔒",
    title: "Security & Compliance",
    desc: "Zero-trust architecture, HIPAA, SOC 2, and GDPR compliance. Security built in from day one, not bolted on later.",
    color: "#14b8a6",
  },
  {
    icon: "⚙",
    title: "DevOps & Scaling",
    desc: "CI/CD pipelines, Kubernetes orchestration, and infrastructure-as-code. Zero-downtime deployments at scale.",
    color: "#8b5cf6",
  },
  {
    icon: "🎨",
    title: "UI/UX Design",
    desc: "Beautiful, intuitive interfaces designed for conversion. User research, prototyping, and design systems that scale.",
    color: "#ec4899",
  },
  {
    icon: "📱",
    title: "Mobile Development",
    desc: "Native iOS, Android, and React Native apps. High-performance, feature-rich mobile experiences for all platforms.",
    color: "#06b6d4",
  },
  {
    icon: "🔍",
    title: "SEO & Digital Marketing",
    desc: "Technical SEO, content strategy, and performance marketing. Drive organic traffic and measurable conversions.",
    color: "#f97316",
  },
  {
    icon: "⚡",
    title: "Performance Optimization",
    desc: "Lightning-fast load times and smooth interactions. Code splitting, caching, CDN optimization, and monitoring.",
    color: "#6366f1",
  },
  {
    icon: "🧪",
    title: "Testing & QA",
    desc: "Comprehensive test coverage with unit, integration, and E2E testing. Automation frameworks and quality assurance.",
    color: "#8b5cf6",
  },
  {
    icon: "🚀",
    title: "Launch & Growth",
    desc: "Go-to-market strategy, analytics setup, and growth hacking. Scale your product from launch to market leader.",
    color: "#10b981",
  },
];

const SCATTER_POSITIONS = [
  { top: "8%", left: "5%", scale: 1 },
  { top: "15%", left: "35%", scale: 1.05 },
  { top: "5%", left: "70%", scale: 0.95 },
  { top: "28%", left: "85%", scale: 1 },
  { top: "45%", left: "12%", scale: 0.98 },
  { top: "42%", left: "55%", scale: 1.02 },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.9, rotate: -2 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    rotate: 0,
    transition: {
      type: "spring",
      stiffness: 120,
      damping: 12,
      mass: 0.8,
    },
  },
};

export default function ServicesGrid() {
  const containerRef = useRef<HTMLDivElement>(null);
  const threeContainerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [cardPositions, setCardPositions] = useState<Array<{ x: number; y: number }>>([]);

  // Update card positions for SVG connections
  useEffect(() => {
    const updateCardPositions = () => {
      const cards = document.querySelectorAll("[data-service-card]");
      const positions = Array.from(cards).map((card) => {
        const rect = card.getBoundingClientRect();
        return {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        };
      });
      setCardPositions(positions);
    };

    setTimeout(updateCardPositions, 500);
    window.addEventListener("resize", updateCardPositions);
    return () => window.removeEventListener("resize", updateCardPositions);
  }, []);

  // Three.js Background Particles
  useEffect(() => {
    if (!threeContainerRef.current) return;

    const width = window.innerWidth;
    const height = window.innerHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(window.devicePixelRatio);
    threeContainerRef.current.appendChild(renderer.domElement);

    camera.position.z = 50;

    // Create network of particles
    const particleCount = 80;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 200;
      positions[i + 1] = (Math.random() - 0.5) * 200;
      positions[i + 2] = (Math.random() - 0.5) * 200;

      // Color variation
      colors[i] = 0.4 + Math.random() * 0.3;
      colors[i + 1] = 0.4 + Math.random() * 0.3;
      colors[i + 2] = Math.random();
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.4,
      vertexColors: true,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.8,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // Create connecting lines between particles
    const linePositions = new Float32Array(particleCount * 2 * 3);
    for (let i = 0; i < particleCount; i++) {
      const nextI = (i + 1) % particleCount;
      linePositions[i * 6] = positions[i * 3];
      linePositions[i * 6 + 1] = positions[i * 3 + 1];
      linePositions[i * 6 + 2] = positions[i * 3 + 2];
      linePositions[i * 6 + 3] = positions[nextI * 3];
      linePositions[i * 6 + 4] = positions[nextI * 3 + 1];
      linePositions[i * 6 + 5] = positions[nextI * 3 + 2];
    }

    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));

    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x6366f1,
      transparent: true,
      opacity: 0.15,
      linewidth: 1,
    });

    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lines);

    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);

      points.rotation.x += 0.0001;
      points.rotation.y += 0.0002;
      lines.rotation.x += 0.0001;
      lines.rotation.y += 0.0002;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationId);
      renderer.dispose();
      geometry.dispose();
      lineGeometry.dispose();
      material.dispose();
      lineMaterial.dispose();
      renderer.domElement.remove();
    };
  }, []);

  // Draw SVG Connection Lines
  useEffect(() => {
    if (!svgRef.current || cardPositions.length === 0) return;

    svgRef.current.innerHTML = "";
    const svgNS = "http://www.w3.org/2000/svg";

    // Draw all connections
    for (let i = 0; i < cardPositions.length; i++) {
      for (let j = i + 1; j < cardPositions.length; j++) {
        const x1 = cardPositions[i].x;
        const y1 = cardPositions[i].y;
        const x2 = cardPositions[j].x;
        const y2 = cardPositions[j].y;

        const distance = Math.hypot(x2 - x1, y2 - y1);

        // Static line
        const line = document.createElementNS(svgNS, "line");
        line.setAttribute("x1", String(x1));
        line.setAttribute("y1", String(y1));
        line.setAttribute("x2", String(x2));
        line.setAttribute("y2", String(y2));
        line.setAttribute("stroke", "#6366f1");
        line.setAttribute("stroke-width", "1.5");
        line.setAttribute("opacity", "0.15");
        line.setAttribute("class", "connection-line");
        svgRef.current.appendChild(line);

        // Animated flowing line
        const animatedLine = document.createElementNS(svgNS, "line");
        animatedLine.setAttribute("x1", String(x1));
        animatedLine.setAttribute("y1", String(y1));
        animatedLine.setAttribute("x2", String(x2));
        animatedLine.setAttribute("y2", String(y2));
        animatedLine.setAttribute("stroke", "#6366f1");
        animatedLine.setAttribute("stroke-width", "2");
        animatedLine.setAttribute("stroke-dasharray", String(distance));
        animatedLine.setAttribute("stroke-dashoffset", String(distance));
        animatedLine.setAttribute("opacity", "0.6");
        animatedLine.setAttribute("class", "animated-connection");
        animatedLine.style.animation = `dashFlow ${4 + Math.random() * 3}s linear infinite`;
        svgRef.current.appendChild(animatedLine);
      }
    }
  }, [cardPositions]);

  return (
    <section
      ref={containerRef}
      className="dark relative min-h-[140vh] overflow-hidden py-32 px-6 bg-surface-dark text-zinc-50"
    >
      {/* Three.js Background Container */}
      <div
        ref={threeContainerRef}
        className="absolute inset-0 z-0 pointer-events-none"
        style={{ perspective: "1000px" }}
      />

      {/* SVG Connection Network */}
      <svg
        ref={svgRef}
        className="absolute inset-0 z-5 pointer-events-none"
        width="100%"
        height="100%"
      />

      {/* Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f23_1px,transparent_1px),linear-gradient(to_bottom,#1f1f23_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_30%,#000_70%,transparent_100%)] opacity-20 pointer-events-none z-0" />

      {/* Animated Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div
          className="absolute top-[20%] left-[10%] w-64 h-64 rounded-full bg-indigo-500/5 blur-[80px]"
          animate={{ scale: [1, 1.2, 1], opacity: [0.05, 0.1, 0.05] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-[30%] right-[5%] w-96 h-96 rounded-full bg-emerald-500/5 blur-[100px]"
          animate={{ scale: [1, 1.1, 1], opacity: [0.05, 0.08, 0.05] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-[60%] left-[40%] w-72 h-72 rounded-full bg-amber-500/5 blur-[90px]"
          animate={{ scale: [1, 1.15, 1], opacity: [0.05, 0.12, 0.05] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative z-10 max-w-[1600px] mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-32"
        >
          <motion.p
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="font-mono text-xs text-primary tracking-[0.3em] uppercase mb-6 font-bold"
          >
            🚀 Our Complete Toolkit
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1] mb-8"
          >
            <span className="block mb-2">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/80 to-primary/60">
                Full-Spectrum
              </span>
            </span>
            <span className="block text-white">
              Engineering Solutions
            </span>
          </motion.h2>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="max-w-3xl mx-auto"
          >
            <p className="text-lg text-muted-foreground font-normal mb-4">
              From frontend to infrastructure, we bring deep expertise across the entire stack.
              Our integrated ecosystem of services creates seamless, interconnected solutions for your business.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <div className="flex items-center gap-2 text-sm text-primary">
                <span className="w-2 h-2 rounded-full bg-primary" />
                12+ Service Categories
              </div>
              <div className="flex items-center gap-2 text-sm text-primary">
                <span className="w-2 h-2 rounded-full bg-primary" />
                Expert Teams
              </div>
              <div className="flex items-center gap-2 text-sm text-primary">
                <span className="w-2 h-2 rounded-full bg-primary" />
                Proven Results
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Services Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="relative min-h-[80vh]"
        >
          {SERVICES.map((service, idx) => {
            const pos = SCATTER_POSITIONS[idx % SCATTER_POSITIONS.length];
            return (
              <ServiceCard
                key={service.title}
                service={service}
                position={pos}
                index={idx}
              />
            );
          })}
        </motion.div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes dashFlow {
          to {
            stroke-dashoffset: 0;
          }
        }

        .animated-connection {
          filter: drop-shadow(0 0 4px rgba(99, 102, 241, 0.6));
        }
      `}</style>
    </section>
  );
}

interface Service {
  icon: string;
  title: string;
  desc: string;
  color: string;
}

interface Position {
  top: string;
  left: string;
  scale: number;
}

function ServiceCard({
  service,
  position,
  index,
}: {
  service: Service;
  position: Position;
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    if (!cardRef.current) return;
    const bounds = cardRef.current.getBoundingClientRect();
    setCoords({
      x: e.clientX - bounds.left,
      y: e.clientY - bounds.top,
    });
  }

  const getCardWidth = () => {
    const widths = ["w-80", "w-72", "w-88", "w-76"];
    return widths[index % widths.length];
  };

  return (
    <motion.div
      ref={cardRef}
      data-service-card
      variants={cardVariants}
      custom={index}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      whileHover={{
        y: -8,
        scale: position.scale * 1.02,
        transition: { type: "spring", stiffness: 300, damping: 20 },
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group absolute ${getCardWidth()} rounded-2xl border border-zinc-800/60 bg-zinc-900/30 p-6 overflow-hidden backdrop-blur-md cursor-pointer transition-all duration-300 hover:border-zinc-700/60 hover:bg-zinc-900/50`}
      style={{
        top: position.top,
        left: position.left,
        transform: `scale(${position.scale})`,
        transformOrigin: "center center",
        zIndex: 10 + index,
      }}
    >
      {/* Glow Effects */}
      <div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(400px circle at ${coords.x}px ${coords.y}px, ${service.color}20, transparent 80%)`,
        }}
      />

      <div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(150px circle at ${coords.x}px ${coords.y}px, ${service.color}70, transparent 100%)`,
          maskImage: "linear-gradient(black, black) content-box, linear-gradient(black, black)",
          WebkitMaskImage: "linear-gradient(black, black) content-box, linear-gradient(black, black)",
          maskComposite: "exclude",
          WebkitMaskComposite: "xor",
          padding: "1px",
        }}
      />

      <div
        className="absolute -top-12 -right-12 w-32 h-32 rounded-full blur-[50px] opacity-0 group-hover:opacity-25 transition-opacity duration-500 pointer-events-none"
        style={{ backgroundColor: service.color }}
      />

      {/* Icon Badge */}
      <div
        className="relative w-12 h-12 rounded-xl flex items-center justify-center text-xl mb-5 border border-zinc-800/50 shadow-inner overflow-hidden"
        style={{ backgroundColor: `${service.color}08` }}
      >
        <motion.div
          className="absolute inset-0 opacity-10 pointer-events-none"
          animate={isHovered ? { opacity: [0.1, 0.3, 0.1] } : { opacity: 0.1 }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          style={{ backgroundColor: service.color }}
        />
        <motion.span
          animate={
            isHovered
              ? { scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }
              : { scale: 1, rotate: 0 }
          }
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="relative z-10"
        >
          {service.icon}
        </motion.span>
      </div>

      {/* Content */}
      <h3 className="relative z-10 text-lg font-bold mb-2 text-zinc-100 tracking-tight group-hover:text-zinc-50 transition-colors">
        {service.title}
      </h3>

      <p className="relative z-10 text-sm text-muted-foreground font-normal leading-relaxed group-hover:text-zinc-300 transition-colors line-clamp-3">
        {service.desc}
      </p>

      {/* Bottom Accent Bar */}
      <motion.div
        className="absolute bottom-0 inset-x-0 h-[2px] origin-left"
        style={{ backgroundColor: service.color }}
        initial={{ scaleX: 0 }}
        whileHover={{ scaleX: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      />

      {/* Corner Accent */}
      <div
        className="absolute bottom-3 right-3 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at bottom right, ${service.color}40, transparent 70%)`,
          borderRadius: "4px",
        }}
      />

      {/* Connection Node */}
      <motion.div
        className="absolute -top-2 -right-2 w-4 h-4 rounded-full border-2"
        style={{ borderColor: service.color, boxShadow: `0 0 10px ${service.color}60` }}
        animate={isHovered ? { scale: [1, 1.3, 1] } : { scale: 1 }}
        transition={{ duration: 0.4, repeat: Infinity }}
      />
    </motion.div>
  );
}
