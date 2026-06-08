const PROJECTS = [
  {
    id: 'thesis',
    title: 'Uncertainty-Aware Path Planning',
    fullTitle: 'Uncertainty-Aware Path Planning for Stewart Platforms',
    date: 'May 2026',
    progress: 100,
    image: 'images/thesis.jpg',
    summary: 'Honors thesis integrating EKF belief propagation with RRT# for uncertainty-minimizing motion planning on Stewart platforms.',
    tags: ['Python', 'MATLAB', 'EKF', 'RRT#', 'Motion Planning', 'State Estimation'],
    writeup: [
      'Aerospace Honors Thesis, University of Maryland 2026. Stewart platforms are widely used in precision aerospace applications due to their high stiffness and 6DOF actuation capabilities. Traditional sampling-based planners optimize for path length alone — ignoring uncertainty that accumulates during actuation.',
      'This work presents a framework that incorporates belief propagation via an Extended Kalman Filter (EKF), using the trace of the error covariance matrix as a cost function during planning. RRT, RRT*, and RRT# planners were implemented and benchmarked in 6DOF configuration space. RRT# demonstrated superior convergence. Results show that path length and estimation uncertainty are not strongly correlated, motivating uncertainty-aware planning as a distinct optimization objective.',
    ],
    media: null,
    pdf: null,             // replace with 'pdfs/thesis.pdf' when ready
    pdfLabel: 'PDF — coming soon',
  },

  {
    id: 'shell',
    title: 'SHELL Docking Tunnel',
    fullTitle: 'SHELL — Softgoods Habitat Entry & Lunar Logistics',
    date: 'May 2026',
    progress: 100,         // 0–100; >= 80 renders green, else yellow
    image: 'images/shell.png',
    heroImage: 'images/shell2.png',
    // github: 'https://github.com/SamSchneidereith/stewart-platform',
    summary: '6DOF softgoods articulating docking tunnel with embedded IK, stepper control, and real-time vision pipeline.',
    tags: ['C++', 'Arduino', 'Python', 'OpenCV', 'ROS', 'Stewart Platform IK', 'Serial Comms', 'SE(3) Transforms', 'AccelStepper Library'],
    writeup: [
      'SHELL (Softgoods Habitat Entry and Lunar Logistics) was a 20-person senior capstone project developing an eighth-scale prototype of a pressurized, articulating softgoods docking tunnel designed for crew transfer between habitats and rovers on the lunar and Martian surface. The tunnel is driven by a cable-actuated Stewart platform mechanism, enabling full six-degree-of-freedom motion of the docking hatch.',
      'I owned the complete embedded software stack. Motor control was implemented in C++ on an Arduino Mega 2560, commanding six NEMA 17 closed-loop stepper motors through dedicated stepper drivers. Each motor drove a cable spool through a 20:1 planetary gearbox, yielding an effective linear resolution of approximately 0.008 mm per step — critical for the precision required in docking maneuvers. All six motors were coordinated simultaneously using the AccelStepper and MultiStepper libraries, ensuring cables reached their target lengths in unison and avoiding slack.',
      'Communication between the embedded controller and the host computer was handled over USB serial at 115200 baud. A Python-based trajectory generation program computed desired end-effector poses, converted them to cable lengths via inverse kinematics, and transmitted them to the Arduino as ASCII packets. A blocking acknowledgement scheme ensured sequential commands were executed in order, preventing buffer overrun during long trajectories.',
      'I also developed the real-time vision pipeline using OpenCV and ROS. The system detected AprilTag fiducial markers mounted around the docking hatch rim and estimated the six-degree-of-freedom pose of the hatch relative to the docking platform. Coordinate transformations between the camera frame, tag frame, hatch frame, and platform measurement frame were managed using homogeneous transformation matrices, with the overall pipeline compliant with NASA International Docking System Standard (IDSS) conventions.',
      'The control system was open-loop — cable lengths were commanded without closed-loop feedback on end-effector pose. Cable spooling inconsistencies introduced length errors on the order of 1–2.5 cm, roughly 5% of nominal cable length, which was acceptable for prototype-level validation. Given additional development time, the vision system would have been integrated as a feedback source for closed-loop pose control.',
      'Below is an excerpt of my individual contributions from the team\'s full report.'
    ],
    media: null,           // { type: 'image'|'video', src: 'path/or/url', alt: 'caption' }
    pdf: 'pdfs/SHELL_SchneidereithContributions.pdf',             // 'pdfs/shell.pdf' or null
    pdfLabel: 'Write-up / PDF — coming soon',
  },

  {
    id: 'stewart',
    title: 'Stewart Platform',
    fullTitle: 'Servo-Actuated Stewart Platform',
    date: 'May 2026',
    progress: 100,
    image: 'images/stewart.jpg',
    summary: 'Personal servo-actuated 6DOF platform built from scratch — mechanical design, embedded C++ firmware, and inverse kinematics.',
    tags: ['C++', 'Inverse Kinematics', 'Servo Control', 'Mechanical Design', 'PCA9685'],
    writeup: [
      'Designed, built, and programmed a 6DOF Stewart platform entirely from scratch — mechanical design, electronics, and firmware. Built as a personal project to develop hands-on intuition for inverse kinematics and embedded C++, directly feeding into the honors thesis and capstone work.',
      'Firmware is written in C++ for an Arduino-compatible microcontroller, interfacing six servos via a PCA9685 PWM driver. Includes smooth trajectory interpolation and a numerical IK solver.',
    ],
    media: null,
    pdf: null,
    pdfLabel: 'Code on GitHub — coming soon',
  },

  {
    id: 'reactionwheel',
    title: 'Reaction Wheel Pendulum',
    fullTitle: 'Reaction Wheel Stabilized Inverted Pendulum',
    date: 'In progress',
    progress: 40,
    image: 'images/reactionwheel.jpg',
    summary: 'LQR/PID stabilized inverted pendulum using a reaction wheel for active torque control.',
    tags: ['C++', 'LQR / PID', 'State-Space', 'Embedded', 'Control Theory'],
    writeup: [
      'An active controls project in development. A reaction wheel provides the stabilizing torque for an inverted pendulum — implementing state-space modeling, LQR and PID controller design, and real-time embedded execution.',
    ],
    media: null,
    pdf: null,
    pdfLabel: 'In development — check back soon',
  },

  {
    id: 'skycrane',
    title: 'Skycrane Payload Controller',
    fullTitle: 'Skycrane Payload Landing Controller',
    date: 'May 2025',
    progress: 100,
    image: 'images/skycrane.jpg',
    summary: 'Lead compensator designed for a Mars skycrane payload — derived from first principles, validated via Bode and Nyquist analysis.',
    tags: ['MATLAB', 'Control Theory', 'Lead Compensator', 'Bode / Nyquist', 'System Identification'],
    writeup: [
      'Derived the transfer function of a Mars skycrane payload system from first principles using Newton\'s second law and Laplace transforms. Physical parameters identified through simulation-based system identification in MATLAB.',
      'Designed a lead compensator with prefilter targeting a 70° phase margin at 0.3 rad/s crossover frequency. Validated closed-loop stability via Bode, Nyquist, and Nichols analysis. Achieved stable overdamped closed-loop step response with minimized payload swing angle under Martian gravity and simulated process noise.',
    ],
    media: null,
    pdf: null,
    pdfLabel: 'Report — coming soon',
  },

  {
    id: 'waverider',
    title: 'Mach 10 Hypersonic Waverider',
    fullTitle: 'Mach 10 Hypersonic Waverider',
    date: 'May 2025',
    progress: 100,
    image: 'images/waverider.jpg',
    summary: 'Aerodynamic shape optimization for a Mach 10 boost-glide waverider using shock relations and CFD simulation.',
    tags: ['MATLAB', 'CFD', 'Shock Relations', 'Trajectory Analysis', 'Aerodynamics'],
    writeup: [
      'Designed a Mach 10 hypersonic waverider, optimizing aerodynamic shape and orientation for maximum trajectory distance using analytical methods and shock relation analysis. Simulated boost-glide trajectory and aerodynamic performance with CFD.',
    ],
    media: null,
    pdf: null,
    pdfLabel: 'Report — coming soon',
  },
];