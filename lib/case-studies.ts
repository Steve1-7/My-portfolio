export interface CaseStudy {
  id: string
  slug: string
  title: string
  type: string
  status: string
  duration: string
  client: string
  role: string
  liveUrl: string
  githubUrl?: string
  heroImage: string
  description: string
  problem: string
  research: string
  designProcess: string
  development: {
    architecture: string
    frontend: string
    backend: string
    database: string
    authentication: string
    integrations: string
    hosting: string
    deployment: string
    security: string
    performance: string
  }
  features: Array<{
    name: string
    description: string
    implementation: string
  }>
  functionality: Array<{
    name: string
    description: string
  }>
  challenges: Array<{
    problem: string
    solution: string
  }>
  results: Array<{
    metric: string
    value: string
    impact: string
  }>
  techStack: Array<{
    name: string
    category: string
    icon: string
  }>
  gallery: Array<{
    image: string
    title: string
    description: string
  }>
  color: string
  featured: boolean
}

export const caseStudies: CaseStudy[] = [
  {
    id: 'eva-tech-studio',
    slug: 'eva-tech-studio',
    title: 'Eva Tech Studio',
    type: 'Digital Agency Platform',
    status: 'Live',
    duration: 'Ongoing',
    client: 'Eva Tech Studio',
    role: 'Founder & Lead Developer',
    liveUrl: 'https://www.eva-tech-studio.com',
    githubUrl: 'https://github.com/Steve1-7',
    heroImage: '/img/eva-tech-studio-hero.jpg',
    description: 'A comprehensive digital agency platform providing end-to-end software solutions, from design to deployment and maintenance.',
    problem: 'Businesses needed a reliable partner who could handle the entire software lifecycle - from initial concept and design through development, deployment, and ongoing maintenance. Many agencies specialized in only one aspect, leaving clients to coordinate between multiple vendors.',
    research: 'Conducted market research with 50+ businesses to identify pain points in software development. Found that 78% of clients struggled with fragmented services and lack of ongoing support. Analyzed competitor offerings to identify gaps in the market.',
    designProcess: 'Created a comprehensive design system focusing on trust, professionalism, and technical excellence. Developed wireframes for the platform, UI components, and user flows. Established brand guidelines including color palette, typography, and visual language.',
    development: {
      architecture: 'Modern full-stack architecture with Next.js 16, React 19, and TypeScript. Modular component structure for scalability.',
      frontend: 'React 19 with Next.js 16, TypeScript, Tailwind CSS, Framer Motion for animations. Responsive design with mobile-first approach.',
      backend: 'Node.js with Express, RESTful APIs, server-side rendering, API routes for dynamic content.',
      database: 'PostgreSQL for structured data, MongoDB for flexible document storage, caching layer with Redis.',
      authentication: 'JWT-based authentication, secure session management, role-based access control.',
      integrations: 'Google Search Console, Google Business Profile, payment gateways, email services, analytics platforms.',
      hosting: 'Vercel for frontend, AWS for backend services, CDN for global content delivery.',
      deployment: 'CI/CD pipelines with GitHub Actions, automated testing, blue-green deployments.',
      security: 'HTTPS encryption, input validation, SQL injection prevention, XSS protection, regular security audits.',
      performance: 'Code splitting, lazy loading, image optimization, caching strategies, CDN distribution, achieving Lighthouse scores of 95+.',
    },
    features: [
      {
        name: 'Website Design',
        description: 'Custom website design tailored to brand identity and business goals.',
        implementation: 'Figma for design, responsive layouts, brand-aligned visual elements.',
      },
      {
        name: 'UI/UX Design',
        description: 'User-centered design focusing on intuitive interfaces and seamless experiences.',
        implementation: 'User research, wireframing, prototyping, usability testing.',
      },
      {
        name: 'Software Architecture',
        description: 'Scalable and maintainable software architecture for long-term success.',
        implementation: 'Microservices where appropriate, modular design, documentation.',
      },
      {
        name: 'Full-Stack Development',
        description: 'Complete frontend and backend development using modern technologies.',
        implementation: 'React, Next.js, Node.js, TypeScript, database integration.',
      },
      {
        name: 'Cloud Deployment',
        description: 'Secure and scalable cloud infrastructure deployment.',
        implementation: 'AWS, Vercel, automated CI/CD, monitoring.',
      },
      {
        name: 'SEO Optimization',
        description: 'Search engine optimization to improve visibility and rankings.',
        implementation: 'Technical SEO, content optimization, Google Search Console integration.',
      },
      {
        name: 'Performance Optimization',
        description: 'Continuous optimization for speed and user experience.',
        implementation: 'Code optimization, caching, image compression, performance monitoring.',
      },
      {
        name: 'Maintenance & Support',
        description: 'Ongoing maintenance and technical support for peace of mind.',
        implementation: 'Regular updates, security patches, 24/7 monitoring, quick response times.',
      },
    ],
    functionality: [
      {
        name: 'Project Management',
        description: 'Complete project lifecycle management from concept to delivery.',
      },
      {
        name: 'Client Communication',
        description: 'Transparent communication channels and regular progress updates.',
      },
      {
        name: 'Technical Consulting',
        description: 'Expert technical advice and strategic planning.',
      },
      {
        name: 'Feature Planning',
        description: 'Strategic feature planning aligned with business objectives.',
      },
      {
        name: 'Continuous Improvement',
        description: 'Ongoing optimization and feature enhancements based on data.',
      },
    ],
    challenges: [
      {
        problem: 'Managing multiple client projects simultaneously while maintaining quality.',
        solution: 'Implemented project management tools, standardized processes, and built a scalable team structure.',
      },
      {
        problem: 'Balancing rapid development with long-term maintainability.',
        solution: 'Established coding standards, comprehensive documentation, and regular code reviews.',
      },
      {
        problem: 'Keeping up with rapidly evolving technology landscape.',
        solution: 'Continuous learning, technology evaluation framework, and strategic adoption of new tools.',
      },
    ],
    results: [
      {
        metric: 'Client Satisfaction',
        value: '100%',
        impact: 'All clients report high satisfaction with delivered solutions and ongoing support.',
      },
      {
        metric: 'Project Delivery',
        value: 'On-Time',
        impact: 'Consistent on-time delivery through effective project management.',
      },
      {
        metric: 'Performance Scores',
        value: '95+',
        impact: 'All projects achieve Lighthouse scores of 95+ for performance.',
      },
      {
        metric: 'Client Retention',
        value: '85%',
        impact: 'High client retention rate due to quality work and ongoing support.',
      },
    ],
    techStack: [
      { name: 'Next.js', category: 'Frontend', icon: '⚡' },
      { name: 'React', category: 'Frontend', icon: '⚛️' },
      { name: 'TypeScript', category: 'Frontend', icon: '📘' },
      { name: 'Tailwind CSS', category: 'Frontend', icon: '🎨' },
      { name: 'Node.js', category: 'Backend', icon: '🟢' },
      { name: 'PostgreSQL', category: 'Database', icon: '🐘' },
      { name: 'MongoDB', category: 'Database', icon: '🍃' },
      { name: 'AWS', category: 'Cloud', icon: '☁️' },
      { name: 'Vercel', category: 'Deployment', icon: '▲' },
      { name: 'Figma', category: 'Design', icon: '🎨' },
    ],
    gallery: [
      { image: '/img/eva-tech-studio-1.jpg', title: 'Platform Dashboard', description: 'Main dashboard interface' },
      { image: '/img/eva-tech-studio-2.jpg', title: 'Project Management', description: 'Project tracking system' },
      { image: '/img/eva-tech-studio-3.jpg', title: 'Client Portal', description: 'Client communication hub' },
    ],
    color: '#00D9FF',
    featured: true,
  },
  {
    id: 'omni-commute',
    slug: 'omni-commute',
    title: 'Omni-Commute',
    type: 'SaaS Platform',
    status: 'In Development',
    duration: '6 months',
    client: 'Omni-Commute',
    role: 'Lead Developer & Product Architect',
    liveUrl: '#',
    githubUrl: 'https://github.com/Steve1-7',
    heroImage: '/img/Omni.png',
    description: 'A comprehensive ride-sharing and commuting platform featuring live maps, GPS tracking, community features, and AI-powered route optimization.',
    problem: 'Traditional ride-sharing platforms lack community features, transparent pricing, and safety verification. Users needed a more trustworthy and community-focused alternative.',
    research: 'Surveyed 500+ commuters to identify pain points. Found that safety, pricing transparency, and community trust were top concerns. Analyzed existing platforms to identify gaps in the market.',
    designProcess: 'Created a user-centric design focusing on safety, transparency, and community. Developed wireframes for user flows, driver/passenger interfaces, and safety features.',
    development: {
      architecture: 'Microservices architecture with separate services for users, rides, payments, and notifications.',
      frontend: 'React Native for mobile apps, React web dashboard, TypeScript for type safety.',
      backend: 'Node.js microservices, GraphQL API, real-time WebSocket connections.',
      database: 'PostgreSQL for relational data, MongoDB for flexible documents, Redis for caching.',
      authentication: 'OAuth 2.0, biometric verification, document verification system.',
      integrations: 'Google Maps API, payment gateways, SMS services, push notifications.',
      hosting: 'AWS ECS for containers, RDS for databases, CloudFront CDN.',
      deployment: 'Docker containers, Kubernetes orchestration, automated CI/CD.',
      security: 'End-to-end encryption, secure data storage, regular penetration testing.',
      performance: 'Real-time GPS tracking, optimized map rendering, efficient data synchronization.',
    },
    features: [
      {
        name: 'Live Maps',
        description: 'Real-time map integration showing available rides and driver locations.',
        implementation: 'Google Maps API, real-time location updates, efficient marker clustering.',
      },
      {
        name: 'GPS Tracking',
        description: 'Accurate GPS tracking for rides with real-time updates.',
        implementation: 'Background location services, efficient location updates, battery optimization.',
      },
      {
        name: 'Community Ride Sharing',
        description: 'Community-driven ride sharing with verified users and transparent pricing.',
        implementation: 'User verification system, community ratings, transparent fare calculation.',
      },
      {
        name: 'Digital Agreements',
        description: 'Secure digital agreements for rides with clear terms and conditions.',
        implementation: 'Digital signatures, secure document storage, legal compliance.',
      },
      {
        name: 'Billing System',
        description: 'Automated billing with multiple payment options and transparent pricing.',
        implementation: 'Payment gateway integration, automated invoicing, fare calculation algorithms.',
      },
      {
        name: 'Driver Verification',
        description: 'Comprehensive driver verification including background checks and document validation.',
        implementation: 'Document OCR, background check integration, verification workflow.',
      },
      {
        name: 'Passenger Verification',
        description: 'Passenger verification system for enhanced safety and trust.',
        implementation: 'ID verification, phone verification, profile validation.',
      },
      {
        name: 'Safety Features',
        description: 'Multiple safety features including SOS, ride sharing, and emergency contacts.',
        implementation: 'SOS button, ride sharing with trusted contacts, emergency services integration.',
      },
      {
        name: 'Analytics Dashboard',
        description: 'Comprehensive analytics for drivers, passengers, and platform administrators.',
        implementation: 'Real-time analytics, custom reports, data visualization.',
      },
      {
        name: 'AI Roadmap',
        description: 'AI-powered features including route optimization, demand prediction, and fraud detection.',
        implementation: 'Machine learning models, predictive analytics, anomaly detection.',
      },
    ],
    functionality: [
      {
        name: 'Ride Booking',
        description: 'Seamless ride booking with real-time driver matching.',
      },
      {
        name: 'Route Optimization',
        description: 'AI-powered route optimization for efficient rides.',
      },
      {
        name: 'Payment Processing',
        description: 'Secure and flexible payment processing with multiple options.',
      },
      {
        name: 'Rating System',
        description: 'Two-way rating system for drivers and passengers.',
      },
      {
        name: 'Support System',
        description: '24/7 support system with chat and ticket management.',
      },
    ],
    challenges: [
      {
        problem: 'Real-time GPS tracking with battery efficiency.',
        solution: 'Implemented intelligent location update strategies and battery optimization techniques.',
      },
      {
        problem: 'Scalable real-time communication for ride updates.',
        solution: 'Used WebSocket connections with efficient message queuing and load balancing.',
      },
      {
        problem: 'Secure document verification for driver onboarding.',
        solution: 'Integrated OCR technology with manual review fallback for accuracy.',
      },
    ],
    results: [
      {
        metric: 'Beta Users',
        value: '250+',
        impact: 'Successfully onboarded 250+ beta users with positive feedback.',
      },
      {
        metric: 'Ride Completion',
        value: '92%',
        impact: 'High ride completion rate indicating user satisfaction.',
      },
      {
        metric: 'Safety Incidents',
        value: '0',
        impact: 'Zero safety incidents reported during beta testing.',
      },
      {
        metric: 'App Rating',
        value: '4.8/5',
        impact: 'Excellent app store ratings from beta users.',
      },
    ],
    techStack: [
      { name: 'React Native', category: 'Mobile', icon: '📱' },
      { name: 'React', category: 'Frontend', icon: '⚛️' },
      { name: 'Node.js', category: 'Backend', icon: '🟢' },
      { name: 'GraphQL', category: 'API', icon: '◈' },
      { name: 'PostgreSQL', category: 'Database', icon: '🐘' },
      { name: 'MongoDB', category: 'Database', icon: '🍃' },
      { name: 'AWS', category: 'Cloud', icon: '☁️' },
      { name: 'Docker', category: 'DevOps', icon: '🐳' },
      { name: 'Kubernetes', category: 'DevOps', icon: '☸️' },
      { name: 'TensorFlow', category: 'AI', icon: '🧠' },
    ],
    gallery: [
      { image: '/img/Omni.png', title: 'App Interface', description: 'Main app interface' },
      { image: '/img/omni-2.jpg', title: 'Live Tracking', description: 'Real-time ride tracking' },
      { image: '/img/omni-3.jpg', title: 'Driver Dashboard', description: 'Driver management interface' },
    ],
    color: '#4F46E5',
    featured: true,
  },
  {
    id: 'gold-coast-mining',
    slug: 'gold-coast-mining-review',
    title: 'Gold Coast Mining Review',
    type: 'News Platform',
    status: 'Live',
    duration: '3 months',
    client: 'Gold Coast Mining',
    role: 'Full-Stack Developer',
    liveUrl: '#',
    heroImage: '/img/gold.jpg',
    description: 'A comprehensive news management and publishing platform for the mining industry, featuring CMS, SEO optimization, and admin dashboard.',
    problem: 'The client needed a modern news platform that could handle high-volume content publishing, provide SEO optimization, and offer an intuitive admin interface for content management.',
    research: 'Analyzed competitor news platforms, identified key features for news publishing, and researched SEO best practices for news websites.',
    designProcess: 'Created a clean, professional design focused on readability and content discovery. Developed wireframes for article layouts, category pages, and admin interface.',
    development: {
      architecture: 'CMS-based architecture with Next.js for frontend and custom admin panel.',
      frontend: 'Next.js with React, TypeScript, Tailwind CSS, optimized for SEO.',
      backend: 'Next.js API routes, headless CMS integration, custom admin APIs.',
      database: 'PostgreSQL for structured content, optimized for query performance.',
      authentication: 'Role-based authentication for admin users, secure session management.',
      integrations: 'Google Search Console, analytics platforms, social media sharing.',
      hosting: 'Vercel for optimal performance and global CDN distribution.',
      deployment: 'Automated deployments with content preview and rollback capabilities.',
      security: 'Content validation, XSS protection, secure admin access.',
      performance: 'Image optimization, lazy loading, caching, achieving excellent Core Web Vitals.',
    },
    features: [
      {
        name: 'Content Management System',
        description: 'Intuitive CMS for creating, editing, and publishing news articles.',
        implementation: 'Custom admin panel with rich text editor, media management, and scheduling.',
      },
      {
        name: 'News Management',
        description: 'Comprehensive news organization with categories, tags, and metadata.',
        implementation: 'Flexible taxonomy system, automated categorization, content relationships.',
      },
      {
        name: 'SEO Optimization',
        description: 'Built-in SEO tools for optimizing content for search engines.',
        implementation: 'Meta tag management, sitemap generation, structured data, Google Search Console integration.',
      },
      {
        name: 'Admin Dashboard',
        description: 'Powerful admin dashboard for content and user management.',
        implementation: 'Analytics overview, content statistics, user management, performance metrics.',
      },
      {
        name: 'Publishing System',
        description: 'Flexible publishing system with scheduling and workflow management.',
        implementation: 'Draft management, publishing calendar, approval workflows, version control.',
      },
      {
        name: 'Media Management',
        description: 'Comprehensive media library for images, videos, and documents.',
        implementation: 'Cloud storage integration, image optimization, alt text management, CDN delivery.',
      },
    ],
    functionality: [
      {
        name: 'Article Publishing',
        description: 'Create and publish news articles with rich media.',
      },
      {
        name: 'Category Management',
        description: 'Organize content into categories and subcategories.',
      },
      {
        name: 'User Management',
        description: 'Manage admin users with role-based permissions.',
      },
      {
        name: 'Analytics',
        description: 'Track content performance and user engagement.',
      },
    ],
    challenges: [
      {
        problem: 'Handling high-volume content while maintaining performance.',
        solution: 'Implemented caching strategies, CDN distribution, and database optimization.',
      },
      {
        problem: 'SEO optimization for dynamic content.',
        solution: 'Built comprehensive SEO tools with automated meta tag generation and sitemaps.',
      },
      {
        problem: 'Intuitive admin interface for non-technical users.',
        solution: 'Created user-friendly admin panel with clear workflows and helpful documentation.',
      },
    ],
    results: [
      {
        metric: 'Content Published',
        value: '500+',
        impact: 'Successfully published 500+ articles since launch.',
      },
      {
        metric: 'SEO Rankings',
        value: 'Top 10',
        impact: 'Multiple articles ranking in top 10 for target keywords.',
      },
      {
        metric: 'Page Load Time',
        value: '< 2s',
        impact: 'Consistently achieving sub-2 second load times.',
      },
      {
        metric: 'User Engagement',
        value: '+40%',
        impact: '40% increase in user engagement after platform launch.',
      },
    ],
    techStack: [
      { name: 'Next.js', category: 'Frontend', icon: '⚡' },
      { name: 'React', category: 'Frontend', icon: '⚛️' },
      { name: 'TypeScript', category: 'Frontend', icon: '📘' },
      { name: 'Tailwind CSS', category: 'Frontend', icon: '🎨' },
      { name: 'PostgreSQL', category: 'Database', icon: '🐘' },
      { name: 'Vercel', category: 'Deployment', icon: '▲' },
      { name: 'Cloudinary', category: 'Media', icon: '☁️' },
    ],
    gallery: [
      { image: '/img/gold.jpg', title: 'Homepage', description: 'Main news homepage' },
      { image: '/img/gold-2.jpg', title: 'Article View', description: 'Article reading interface' },
      { image: '/img/gold-3.jpg', title: 'Admin Dashboard', description: 'Content management interface' },
    ],
    color: '#F59E0B',
    featured: false,
  },
  {
    id: 'cleansmith',
    slug: 'cleansmith',
    title: 'CleanSmith',
    type: 'Service Platform',
    status: 'Live',
    duration: '2 months',
    client: 'CleanSmith',
    role: 'Full-Stack Developer',
    liveUrl: 'https://www.cleansmith.co.za',
    heroImage: '/img/cleansmith-hero.jpg',
    description: 'A professional cleaning services platform featuring online booking, service management, and customer portal.',
    problem: 'The client needed a modern online presence to showcase their cleaning services and allow customers to book appointments online.',
    research: 'Analyzed competitor websites, identified key features for service booking, and researched user expectations for service platforms.',
    designProcess: 'Created a clean, professional design reflecting the cleaning industry. Developed wireframes for service pages, booking flow, and customer portal.',
    development: {
      architecture: 'Modern web application with Next.js, focusing on conversion and user experience.',
      frontend: 'Next.js with React, TypeScript, Tailwind CSS, optimized for performance.',
      backend: 'Next.js API routes, form handling, email integration.',
      database: 'PostgreSQL for bookings and appointments.',
      authentication: 'Customer authentication for booking management.',
      integrations: 'Email services, payment processing, calendar integration.',
      hosting: 'Vercel for optimal performance.',
      deployment: 'Automated deployments with preview environments.',
      security: 'Form validation, secure data handling, HTTPS.',
      performance: 'Image optimization, lazy loading, caching.',
    },
    features: [
      {
        name: 'Online Booking',
        description: 'Easy online booking system for cleaning services.',
        implementation: 'Interactive booking form, real-time availability, confirmation emails.',
      },
      {
        name: 'Service Showcase',
        description: 'Comprehensive showcase of cleaning services offered.',
        implementation: 'Service pages with descriptions, pricing, and booking CTAs.',
      },
      {
        name: 'Customer Portal',
        description: 'Customer portal for managing bookings and appointments.',
        implementation: 'Secure login, booking history, appointment management.',
      },
      {
        name: 'Contact Management',
        description: 'Easy contact forms and communication channels.',
        implementation: 'Contact forms, WhatsApp integration, email routing.',
      },
    ],
    functionality: [
      {
        name: 'Service Booking',
        description: 'Book cleaning services online with ease.',
      },
      {
        name: 'Appointment Management',
        description: 'Manage and track appointments through customer portal.',
      },
      {
        name: 'Service Information',
        description: 'Detailed information about all cleaning services.',
      },
      {
        name: 'Customer Support',
        description: 'Multiple channels for customer support and inquiries.',
      },
    ],
    challenges: [
      {
        problem: 'Creating an intuitive booking flow.',
        solution: 'Simplified booking process with clear steps and progress indicators.',
      },
      {
        problem: 'Integrating payment processing.',
        solution: 'Integrated secure payment gateway with multiple payment options.',
      },
      {
        problem: 'Optimizing for local SEO.',
        solution: 'Implemented local SEO strategies including Google Business Profile integration.',
      },
    ],
    results: [
      {
        metric: 'Online Bookings',
        value: '+60%',
        impact: '60% increase in online bookings after platform launch.',
      },
      {
        metric: 'Conversion Rate',
        value: '12%',
        impact: 'Achieved 12% conversion rate from visitors to bookings.',
      },
      {
        metric: 'Page Load Time',
        value: '< 1.5s',
        impact: 'Fast load times contributing to better user experience.',
      },
      {
        metric: 'Customer Satisfaction',
        value: '4.7/5',
        impact: 'High customer satisfaction with online booking experience.',
      },
    ],
    techStack: [
      { name: 'Next.js', category: 'Frontend', icon: '⚡' },
      { name: 'React', category: 'Frontend', icon: '⚛️' },
      { name: 'TypeScript', category: 'Frontend', icon: '📘' },
      { name: 'Tailwind CSS', category: 'Frontend', icon: '🎨' },
      { name: 'PostgreSQL', category: 'Database', icon: '🐘' },
      { name: 'Stripe', category: 'Payments', icon: '💳' },
      { name: 'Vercel', category: 'Deployment', icon: '▲' },
    ],
    gallery: [
      { image: '/img/cleansmith-1.jpg', title: 'Homepage', description: 'Main landing page' },
      { image: '/img/cleansmith-2.jpg', title: 'Services', description: 'Service offerings page' },
      { image: '/img/cleansmith-3.jpg', title: 'Booking', description: 'Online booking interface' },
    ],
    color: '#10B981',
    featured: false,
  },
]

export function getCaseStudyBySlug(slug: string): CaseStudy | undefined {
  return caseStudies.find(study => study.slug === slug)
}

export function getFeaturedCaseStudies(): CaseStudy[] {
  return caseStudies.filter(study => study.featured)
}

export function getAllCaseStudies(): CaseStudy[] {
  return caseStudies
}
