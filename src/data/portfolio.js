// src/data/portfolio.js
// Single source of dummy content for the portfolio. Components read ONLY from
// this object — no content strings are hardcoded in JSX.
//
// Swap every placeholder below for the client's real content.
// Images: drop real files in /public/images and set the string path (e.g. '/images/mission-01.jpg').
// Leaving an image null renders the built-in gradient/SVG placeholder with alt="".
// When a real image is set, also give it a descriptive alt (see the `alt` fields where present).

export default {
  identity: {
    name: 'Alex Carter',
    callsign: 'AC-01', // shown as logo mark / mono tag
    role: 'Drone Systems Engineer / UAV Specialist',
    tagline: 'Designing, flying, and automating unmanned aerial systems — from firmware to flight line.',
    location: 'San Francisco, CA', // "BASE"
    status: 'AVAILABLE', // chip in navbar/about
    flightHours: 1240, // telemetry stat
    avatar: null, // '/images/avatar.jpg' later
    resumeUrl: '#', // link; '#' = disabled placeholder
  },

  hero: {
    // decorative animated telemetry seeds (values tick client-side around these per §2 reducer)
    telemetry: {
      altitude: 412, // m   — ticks ±0..3, clamped [380,440]
      battery: 87, // %   — decrements 1% every 5 ticks, floor 60
      gps: '37.42°N  122.17°W', // static
      signal: 4, // 0..5 bars — static
      speed: 14.2, // m/s — ticks ±0..0.4, clamped [10,18]
    },
  },

  about: {
    bio: [
      'First paragraph … placeholder bio for a drone-technology professional.',
      'Second paragraph … experience across platforms, payloads, and mapping.',
    ],
    stats: [
      { label: 'YEARS ACTIVE', value: '7+' },
      { label: 'MISSIONS FLOWN', value: '320' },
      { label: 'PLATFORMS', value: '12' },
    ],
  },

  // Each group → one HUD card in Skills. level 0..5 drives SignalBars.
  skillGroups: [
    { id: 'flight', title: 'Flight Systems & Controls',
      skills: [ { name: 'PX4 / ArduPilot', level: 5 }, { name: 'MAVLink', level: 5 },
                { name: 'PID Tuning', level: 4 }, { name: 'Autonomous Mission Planning', level: 4 } ] },
    { id: 'payload', title: 'Payloads & Sensors',
      skills: [ { name: 'LiDAR', level: 4 }, { name: 'Multispectral', level: 4 },
                { name: 'Thermal (IR)', level: 3 }, { name: 'Gimbal/EO Integration', level: 4 } ] },
    { id: 'gis', title: 'GIS & Aerial Mapping / Photogrammetry',
      skills: [ { name: 'Pix4D', level: 5 }, { name: 'Agisoft Metashape', level: 4 },
                { name: 'QGIS', level: 4 }, { name: 'Orthomosaic / DEM', level: 4 } ] },
    { id: 'firmware', title: 'Firmware & Embedded',
      skills: [ { name: 'C / C++', level: 5 }, { name: 'STM32 / ESP32', level: 4 },
                { name: 'RTOS', level: 3 }, { name: 'ESC & Motor Control', level: 4 } ] },
    { id: 'data', title: 'Data Processing',
      skills: [ { name: 'Python', level: 5 }, { name: 'ROS / ROS2', level: 4 },
                { name: 'OpenCV', level: 4 }, { name: 'Point Cloud (PDAL)', level: 3 } ] },
    { id: 'regs', title: 'Regulations & Certifications',
      skills: [ { name: 'FAA Part 107', level: 5 }, { name: 'BVLOS Ops', level: 3 },
                { name: 'Airspace / LAANC', level: 4 }, { name: 'Safety Case Authoring', level: 3 } ] },
  ],

  // "Flight Log" timeline — newest first. status: 'current' | 'past'
  experience: [
    { id: 'SORTIE-07', role: 'Senior Drone Systems Engineer', org: 'SkyGrid Robotics',
      start: '2022', end: 'PRESENT', status: 'current',
      highlights: [ 'Lead autonomy stack for BVLOS inspection fleet.',
                    'Integrated LiDAR + RTK GPS pipeline.' ] },
    { id: 'SORTIE-04', role: 'UAV Mapping Specialist', org: 'TerraMap Surveys',
      start: '2019', end: '2022', status: 'past',
      highlights: [ 'Delivered 200+ photogrammetry survey missions.',
                    'Built automated orthomosaic processing pipeline.' ] },
    { id: 'SORTIE-01', role: 'Flight Firmware Engineer', org: 'AeroCore Systems',
      start: '2017', end: '2019', status: 'past',
      highlights: [ 'Developed ESC firmware and failsafe logic.',
                    'Tuned flight controllers across 6 airframes.' ] },
  ],

  // "Mission Logs" (projects). status: 'COMPLETE' | 'ACTIVE' | 'CLASSIFIED'
  // chip colors: COMPLETE→hud.green, ACTIVE→hud.amber, CLASSIFIED→hud.dim (lock glyph, redacted)
  projects: [
    { id: 'MISSION-001', title: 'Autonomous Infrastructure Inspection',
      status: 'ACTIVE', objective: 'BVLOS autonomous inspection of power corridors.',
      tech: ['PX4', 'ROS2', 'LiDAR', 'RTK'], image: null, alt: '' },
    { id: 'MISSION-002', title: 'Precision Agriculture Mapping',
      status: 'COMPLETE', objective: 'Multispectral crop-health orthomosaics at scale.',
      tech: ['Pix4D', 'Multispectral', 'QGIS'], image: null, alt: '' },
    { id: 'MISSION-003', title: 'Search & Rescue Thermal Platform',
      status: 'COMPLETE', objective: 'Thermal-guided SAR with real-time downlink.',
      tech: ['Thermal IR', 'MAVLink', 'Python'], image: null, alt: '' },
    { id: 'MISSION-004', title: 'Swarm Coordination R&D',
      status: 'CLASSIFIED', objective: 'Multi-agent formation flight experiments.',
      tech: ['ROS2', 'C++', 'RTOS'], image: null, alt: '' },
  ],

  // Gallery placeholders. caption shows as mono EXIF-style overlay.
  gallery: [
    { id: 'IMG_0042', caption: '1/2000s · f/2.8 · ISO100', image: null, alt: '', coords: '37.80°N 122.27°W' },
    { id: 'IMG_0043', caption: '1/1600s · f/4 · ISO200', image: null, alt: '', coords: '36.11°N 115.17°W' },
    { id: 'IMG_0044', caption: '1/1000s · f/2.8 · ISO100', image: null, alt: '', coords: '34.05°N 118.24°W' },
    { id: 'IMG_0045', caption: '1/3200s · f/5.6 · ISO100', image: null, alt: '', coords: '40.71°N 74.00°W' },
    { id: 'IMG_0046', caption: '1/800s · f/4 · ISO400', image: null, alt: '', coords: '47.60°N 122.33°W' },
    { id: 'IMG_0047', caption: '1/2000s · f/2.8 · ISO100', image: null, alt: '', coords: '29.76°N 95.36°W' },
  ],

  certifications: [
    { id: 'cert-1', name: 'FAA Part 107 Remote Pilot', issuer: 'FAA', year: '2018' },
    { id: 'cert-2', name: 'BVLOS Waiver Authorization', issuer: 'FAA', year: '2021' },
    { id: 'cert-3', name: 'Pix4D Certified', issuer: 'Pix4D', year: '2020' },
  ],

  contact: {
    email: 'alex.carter@example.com',
    socials: [
      { label: 'GITHUB', url: 'https://github.com/', handle: '@alexcarter' },
      { label: 'LINKEDIN', url: 'https://linkedin.com/', handle: 'in/alexcarter' },
      { label: 'X', url: 'https://x.com/', handle: '@alexcarter_uav' },
    ],
  },

  nav: [
    // drives navbar + smooth-scroll targets
    { id: 'about', label: 'ABOUT' }, { id: 'skills', label: 'SKILLS' },
    { id: 'experience', label: 'FLIGHT LOG' }, { id: 'missions', label: 'MISSIONS' },
    { id: 'gallery', label: 'GALLERY' }, { id: 'contact', label: 'CONTACT' },
  ],
}
