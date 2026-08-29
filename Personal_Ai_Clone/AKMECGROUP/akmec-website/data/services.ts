export interface ServiceCapability {
  name: string;
}

export interface ServiceCategory {
  title: string;
  items: string[];
}

export interface Service {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  thumbnail: string;
  capabilities: string[];
  categories?: ServiceCategory[];
}

export const services: Service[] = [
  {
    id: 'inspection-audit',
    title: 'Inspection & Audit',
    slug: 'inspection-and-audit',
    shortDescription: 'Comprehensive inspection, QA/QC, and auditing services to ensure safety and compliance across industrial sectors.',
    thumbnail: '/media/services/insp-offshore-lifting.jpg',
    capabilities: [
      'Second Party Inspection', 'Third Party Inspection', 'Expediting', 'Audit', 
      'Vendor / Source Inspection', 'Quantity Survey', 'Pre-Shipment Inspection', 
      'Quality Assurance & Control', 'Lab Test Witness & Inspection', 
      'NDT Inspector (ASNT, PCN, ISO)', 'EPC & Turnkey Project Inspection', 
      'Shutdown / Turnaround Inspection', 'In-Service Inspection', 
      'Fuel Tanker & Truck Inspection', 'ISO Inspector & Auditor', 'RTFI',
      'QA/QC', 'Material Inspection', 'Factory Acceptance Test (FAT)', 'Capability Assessment'
    ],
    categories: [
      {
        title: 'Inspection Disciplines',
        items: [
          'Electrical & Instrumentation', 'CompEx', 'E&I Inspector', 'Scaffolding', 
          'Material', 'HVAC', 'Bridge & Tunnel', 'Static', 'Piping', 'Pipe', 
          'Structure', 'Pipeline', 'Tank', 'Rotary', 'Cargo', 'Container', 'Lifting Equipment'
        ]
      }
    ]
  },
  {
    id: 'examination-testing',
    title: 'Examination & Testing (NDT)',
    slug: 'ndt-testing',
    shortDescription: 'Advanced and conventional non-destructive testing for precise flaw detection and material analysis.',
    thumbnail: '/media/ndt/ut-thickness-probe.jpg',
    capabilities: [],
    categories: [
      {
        title: 'Conventional NDT',
        items: [
          'Penetrant Testing (PT)', 'Magnetic Particle Testing (MPT)', 'UT Flaw Detection', 
          'UT Thickness Gauging', 'Holiday Test', 'Ferritic Test', 'Hardness Test', 'Leak Testing'
        ]
      },
      {
        title: 'Advanced NDT',
        items: [
          'Eddy Current Testing (ECT)', 'Magnetic Flux Leakage (MFL)', 'Near Field Testing (NFT)', 
          'Internal Rotary Inspection System (IRIS)', 'Remote Field Testing (RFT)', 
          'Phased Array Ultrasonic Testing (PAUT)', 'Time of Flight Diffraction (TOFD)'
        ]
      },
      {
        title: 'Advanced Techniques & Others',
        items: [
          'Eddy Current Array (ECA)', 'Borescope Inspection', 'Corrosion Mapping', 
          'Infrared Thermography', 'Positive Material Identification (PMI)', 'Vacuum Box Test', 
          'Heat Treatment Services'
        ]
      }
    ]
  },
  {
    id: 'asset-integrity',
    title: 'Asset Integrity & Technical Solutions',
    slug: 'asset-integrity',
    shortDescription: 'Engineering and reliability services to extend equipment life and optimize asset performance.',
    thumbnail: '/media/asset-integrity/pipework-valves-mono.jpg',
    capabilities: [
      'Corrosion Control Document (CCD)', 'Risk Based Inspection (RBI)', 
      'Asset Integrity Management', 'Develop Inspection Scope & Technique', 
      'Residual / Remaining Life Assessment', 'Fitness For Service (API 579 / ASME)', 
      'Corrosion Loop & Corrosion Circuit', 'Assessment of UG / Cross-country Pipeline', 
      'Asset Life Extension Study', 'Isometric, P&ID and PFD Drafting', 
      'CML Identification & Optimization', 'Study of Online Corrosion Probes & Coupons', 
      'Process Environment Severity Analysis (PESA)', 'Inspection Data Management & Automation', 
      'Industrial Failure Analysis with Effective Remedies', 'Assessment of Small-bore Piping / Critical Equipment', 
      'Design Consultation', 'Consulting Services', 'Engineering Consultant'
    ]
  },
  {
    id: 'manpower-supply',
    title: 'Manpower Supply & Outsourcing',
    slug: 'manpower-outsourcing',
    shortDescription: 'Delivering skilled technical manpower for projects, operations, and facility management.',
    thumbnail: '/media/manpower/workforce-group.jpg',
    capabilities: [
      'Engineering Services', 'EPC & Turnkey Projects', 'Shutdown & Turnaround', 
      'Operation & Maintenance', 'Project Management', 'Testing & Commissioning', 
      'Vigilance & Surveillance', 'Construction & Manufacturing', 'Technical Staffing',
      'Facility Management', 'Industrial Services', 'Human Resources'
    ]
  },
  {
    id: 'training-certification',
    title: 'Training & Certification',
    slug: 'training-certification',
    shortDescription: 'Empowering professionals with industry-recognized training and certifications.',
    thumbnail: '/media/manpower/training-classroom.jpg',
    capabilities: [
      'NDT Levels (RT, PT, UT, MT)', 'QC Engineer Training', 'Shutdown / Turnaround for QC', 
      'Inspection & QC Engineer', 'API 510', 'API 570', 'API 653', 'API 580', 'API 571', 'API 936'
    ]
  },
  {
    id: 'heat-treatment',
    title: 'Heat Treatment Services',
    slug: 'heat-treatment',
    shortDescription: 'Precise thermal processing including pre-heating, post-heating, and stress relieving.',
    thumbnail: '/media/ndt/heat-treatment-web.webp',
    capabilities: [
      'Pre-heating', 'Post-heating', 'Stress Relieving (SR)', 'Intermediate SR', 
      'Dehydrogenation', 'Drying of refractory material'
    ]
  }
];

