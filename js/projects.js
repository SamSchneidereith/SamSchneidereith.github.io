const PROJECTS = [
  {
    id: 'thesis',
    title: 'Uncertainty-Aware Path Planning',
    fullTitle: 'Uncertainty-Aware Path Planning for Stewart Platforms',
    date: 'April 2026',
    progress: 100,         // 0–100; >= 80 renders green, else yellow
    image: 'media/thesis-RRTstar.png',
    // heroImage: 'media/ExampleTrajectory.png',
    github: 'https://github.com/SamSchneidereith/uncertainty-aware-path-planning-for-SP',
    summary: 'Aerospace honors thesis developing an uncertainty-aware motion planning framework for Stewart platforms, using an Extended Kalman Filter and RRT# to find trajectories that minimize estimation uncertainty.',
    tags: ['Python', 'MATLAB', 'EKF', 'RRT#', 'Motion Planning', 'State Estimation', 'Stewart Platform IK'],
    writeup: [
      'Stewart platforms are a class of parallel robotic manipulator widely used in precision aerospace applications from flight simulators to docking mechanisms due to their high stiffness and six-degree-of-freedom actuation. In tasks like in-orbit assembly, maintaining accurate knowledge of the platform\'s state throughout motion is critical. A positioning error mid-maneuver can mean misalignment or damage to high-value hardware.',
      'Traditional motion planners optimize for the shortest path between two configurations. This work asks a different question: what if we optimize for the path that keeps us most certain about where we are? All robotic motion accumulates uncertainty from actuator imperfections, process disturbances, and sensor noise. A shorter path isn\'t necessarily a safer one if it takes the platform through configurations where that uncertainty grows rapidly.',
      'To quantify uncertainty along a trajectory, an Extended Kalman Filter (EKF) was implemented to propagate state covariance as the platform moves. The EKF continuously estimates how confident we are in the platform\'s pose at each point along a candidate path, producing a scalar uncertainty cost that can be used in place of path length during planning.',
      'Three sampling-based motion planners from the RRT family were implemented and benchmarked in the full six-dimensional configuration space of the platform. RRT builds a tree rapidly but doesn\'t optimize. RRT* improves paths over time but converges slowly. RRT#, the most advanced of the three, propagates cost improvements efficiently throughout the entire tree, and was the only algorithm to consistently converge to near-optimal solutions. After 60 seconds of planning, 100% of RRT# trials met the success criteria versus roughly 10% for RRT and RRT*.',
      'When uncertainty was used as the optimization metric instead of path length, the planner successfully identified trajectories with progressively lower estimation uncertainty over time. The most significant finding was that path length and path uncertainty are not strongly correlated. The uncertainty-minimizing planner found paths that were geometrically distinct from the shortest-path solutions, sometimes longer, sometimes shorter. This suggests that uncertainty-aware planning must be treated as its own optimization objective rather than an approximation of path length.',
    ],
    media: [
      {type: 'image', src: 'media/thesis-ExampleTrajectory.png', alt: '', layout: 'full'}, 
      {type: 'image', src: 'media/thesis-CostVsTime.png', alt: '', layout: 'half'}, 
      {type: 'image', src: 'media/thesis-DistVsTime.png', alt: '', layout: 'half'},  
    ],      // { type: 'image'|'video', src: 'path/or/url', alt: 'caption' }
    pdf: 'pdfs/Uncertainty_Aware_Path_Planning_for_Stewart_Platforms.pdf',             // replace with 'pdfs/thesis.pdf' when ready
    pdfLabel: 'PDF — coming soon',
  },

  {
    id: 'orbitsim',
    title: 'Orbit Collision Detection Simulation',
    fullTitle: 'Distributed Satellite Tracking & Conjunction Detection System',
    date: 'In progress',
    progress: 75,           // core sim/track/detect/visualize pipeline works end to end;
                            // collision-probability scoring and maneuver planning are stubbed
    image: 'media/orbitsim-multipleConjunctionsNoBackground.png',
    heroImage: 'media/orbitsim-my_plot.png',
    github: 'https://github.com/SamSchneidereith/orbit-collision-detection-simulation',
    summary: 'A Dockerized, message-passing pipeline that simulates a satellite constellation, filters noisy telemetry through per-satellite Extended Kalman Filters, and automatically screens for close approaches.',
    tags: ['Python', 'Docker', 'Extended Kalman Filter', 'Orbital Mechanics', 'RabbitMQ'],
    writeup: [
      'Modern satellite operations increasingly rely on automated conjunction assessment, continuously tracking a constellation\'s members and flagging close approaches ("conjunctions") before they become collisions. This project is a distributed system that simulates a small satellite constellation, estimates each satellite\'s state from noisy telemetry, and screens every orbit for close approaches in real time, structured the way an operational ground segment separates propagation, orbit determination, and conjunction assessment into independent services.',
      'The system runs as four Dockerized microservices connected over a RabbitMQ message broker: a simulator that propagates true satellite motion and emits noisy telemetry, a tracker that filters that telemetry into state estimates, an application service that screens for conjunctions, and a live 3D plotter. Decoupling the pipeline this way means each service can be scaled, restarted, or swapped independently; the tracker doesn\'t know or care how the simulator generates telemetry, only that it arrives on a queue.',
      'The simulator initializes a satellite constellation from classical orbital elements (semi-major axis, eccentricity, inclination, RAAN, argument of perigee, true anomaly) converted to Cartesian state, then propagates each satellite forward under two-body gravity using 4th-order Runge-Kutta integration. Each satellite publishes position telemetry corrupted with sensor noise at a randomized 5-15 second cadence, mimicking the asynchronous tasking of real ground-based tracking sensors. The dynamics module is structured to add J2 oblateness and atmospheric drag perturbations as well.',
      'The tracker spins up an independent Extended Kalman Filter per satellite on first contact. Each filter\'s predict step propagates the state estimate with the same RK4 integrator and propagates covariance using an analytically derived state transition Jacobian of the two-body gravity gradient; the update step assimilates the noisy position telemetry with a standard EKF gain. Comparing filter output against the simulator\'s hidden ground-truth channel validated that the 3σ covariance envelope correctly bounds the true trajectory, and that the filter re-converges cleanly after an intentionally poor initial velocity guess.',
      'The application service maintains a live track database, propagates a snapshot of every tracked satellite forward across a several-thousand-second projection window, and checks all pairwise combinations at each timestep for a miss distance under a threshold, recording the time and distance of closest approach for anything that qualifies. There is much room for optimization in the collision checking algorithm and I plan to implement a hash table or KD-tree data structure soon in order to only check for conjunctions between satellites in the same spacial region. Flagged conjunctions are highlighted in the live 3D visualization alongside the constellation.',
      'The next steps are to turn miss distance into an actual probability of collision from the combined covariance, and automatically planning an avoidance maneuver once a conjunction is confirmed. These are scaffolded in the code but not yet coded. At the moment I am currently deciding how avoidance maneuvers should be decided. The most obvious approach is to raise and lower satellite altitudes similarly to TCAS commands in airplanes. This would be most efficient if done half a period before the conjunction via a prograde/retrograde burn. If a conjunction comes up later than half a period before conjunction, radial in/out burns would be advantageous, though more aggressive in orbit deformation, likely having to be undone later on. Another solution would be to change inclination through a normal/antinormal burn but this could more easily set the satellite on a trajectory that intersects other orbits. I am currently debating what the best way to approach this planning may be. Maneuver commands will be sent through the already integrated \'maneuver\' queue parametrized by burn duration, vector direction and start time. The thrust acceleration will likely be a satellite attribute and will be based on standard hall-effect engine thrusts and telecommunication satellite masses.',
    ],
    media: [
      {type: 'image', src: 'media/orbitsim-EKF1.png', alt: 'EKF tracker estimate vs. ground truth (x/y/z) with 3σ bounds. Assumes much process noise', layout: 'half'},
      {type: 'image', src: 'media/orbitsim-EKF2.png', alt: 'EKF estimate re-converging after an intentionally poor initial velocity guess', layout: 'half'},
    ],
    pdf: null,
    pdfLabel: 'Report — coming soon',
  },

  {
    id: 'shell',
    title: 'SHELL Docking Tunnel',
    fullTitle: 'SHELL — Softgoods Habitat Entry & Lunar Logistics',
    date: 'May 2026',
    progress: 100,
    image: 'media/shell-shell.png',
    heroImage: 'media/shell-shell2.png',
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
    media: [
      { type: 'youtube', src: 'EUqyI62oerk', alt: 'Stewart platform precession demo' },
    ],
    pdf: 'pdfs/SHELL_SchneidereithContributions.pdf',
    pdfLabel: 'PDF — coming soon',
  },

  {
    id: 'stewart',
    title: 'Stewart Platform',
    fullTitle: 'Servo-Actuated Stewart Platform',
    date: 'June 2026',
    progress: 100,
    image: 'media/stewart-StewartPlatform.png',
    heroImage: 'media/stewart-StewartPlatform2.png',
    github: 'https://github.com/SamSchneidereith/stewart-platform',
    summary: 'Personal 6DOF Stewart platform built from scratch — mechanical design, layered embedded C++ firmware on an ESP32, and a numerical inverse kinematics solver running at 50Hz.',    tags: ['C++', 'ESP32', 'PCA9685', 'I2C', 'Inverse Kinematics', 'Servo Control', 'Embedded Systems', 'Mechanical Design'],    
    writeup: [
      'A Stewart platform is a parallel robotic manipulator capable of motion in all six degrees of freedom: translation in x, y, and z, plus roll, pitch, and yaw. Unlike serial manipulators which chain joints end-to-end, a Stewart platform connects its moving plate to a fixed base through six independent actuated legs, giving it high structural stiffness and precise positional control. This project was built from scratch as a personal testbed for studying robotic kinematics, real-time embedded control, and motion planning ahead of my honors thesis and capstone work.',
      'The mechanical design consists of two hexagonal plates connected by six rigid rods, each attached at the base to a servo horn and at the platform end to a ball-and-socket joint. Six RC hobby servos are driven by a PCA9685 16-channel PWM driver over I2C at 400 kHz, with the ESP32 microcontroller running at 240 MHz. Each servo has individually calibrated minimum and maximum pulse widths to account for unit-to-unit variation, and an inversion flag to handle the alternating physical orientation of servos around the base ring.',
      'The inverse kinematics solver takes a desired 6-DOF pose represented as a translation and ZYX Euler rotation and computes the required horn angle for each of the six servos. Rather than a closed-form solution, the solver performs a numerical sweep over the valid angle range at 0.1° resolution, selecting the angle that minimizes the residual between the actual and target rod length. A pose is accepted only if all six legs solve within a 0.5mm tolerance; otherwise motion is aborted. The solver runs comfortably within the 20ms update budget on the ESP32.',
      'Smooth trajectories are achieved through linear pose interpolation at 50 Hz. The current pose and target pose are interpolated over N steps, with IK solved at each intermediate pose. Two continuous motion sequences were implemented: a flat circular precession where the platform centroid traces a horizontal circle, and an angled gyroscopic precession that combines translational and angular circular motion to simulate a precessing gyroscope.',
      'The firmware is structured into well-separated layers from I2C primitives up to named motion sequences, making the codebase straightforward to extend. Future work includes deriving a closed-form IK solution for reduced latency, implementing S-curve velocity profiles to eliminate endpoint discontinuities, and mounting an IMU to close the control loop for active stabilization.',
    ],
    media: [
      // { type: 'youtube', src: 'EUqyI62oerk', alt: 'Stewart platform precession demo' },
    ],
    pdf: 'pdfs/Servo_Actuated_Stewart_Platform.pdf',
    pdfLabel: 'PDF — coming soon',
  },

  // {
  //   id: 'reactionwheel',
  //   title: 'Reaction Wheel Pendulum',
  //   fullTitle: 'Reaction Wheel Stabilized Inverted Pendulum',
  //   date: 'In progress',
  //   progress: 25,
  //   image: 'media/reactionwheel.jpg',
  //   summary: 'LQR/PID stabilized inverted pendulum using a reaction wheel for active torque control.',
  //   tags: ['C++', 'LQR / PID', 'State-Space', 'Embedded', 'Control Theory'],
  //   writeup: [
  //     'An active controls project in development. A reaction wheel provides the stabilizing torque for an inverted pendulum — implementing state-space modeling, LQR controller design, and real-time embedded execution.',
  //   ],
  //   media: null,
  //   pdf: null,
  //   pdfLabel: 'In development — check back soon',
  // },

  // {
  //   id: 'skycrane',
  //   title: 'Skycrane Payload Controller',
  //   fullTitle: 'Skycrane Payload Landing Controller',
  //   date: 'May 2025',
  //   progress: 100,
  //   image: 'media/skycrane.jpg',
  //   summary: 'Lead compensator designed for a Mars skycrane payload — derived from first principles, validated via Bode and Nyquist analysis.',
  //   tags: ['MATLAB', 'Control Theory', 'Lead Compensator', 'Bode / Nyquist', 'System Identification'],
  //   writeup: [
  //     'Derived the transfer function of a Mars skycrane payload system from first principles using Newton\'s second law and Laplace transforms. Physical parameters identified through simulation-based system identification in MATLAB.',
  //     'Designed a lead compensator with prefilter targeting a 70° phase margin at 0.3 rad/s crossover frequency. Validated closed-loop stability via Bode, Nyquist, and Nichols analysis. Achieved stable overdamped closed-loop step response with minimized payload swing angle under Martian gravity and simulated process noise.',
  //   ],
  //   media: null,
  //   pdf: null,
  //   pdfLabel: 'Report — coming soon',
  // },

  // {
    // id: 'waverider',
    // title: 'Mach 10 Hypersonic Waverider',
    // fullTitle: 'Mach 10 Hypersonic Waverider',
    // date: 'May 2025',
    // progress: 100,
    // image: 'media/waverider.jpg',
    // summary: 'Aerodynamic shape optimization for a Mach 10 boost-glide waverider using shock relations and CFD simulation.',
    // tags: ['MATLAB', 'CFD', 'Shock Relations', 'Trajectory Analysis', 'Aerodynamics'],
    // writeup: [
    //   'Designed a Mach 10 hypersonic waverider, optimizing aerodynamic shape and orientation for maximum trajectory distance using analytical methods and shock relation analysis. Simulated boost-glide trajectory and aerodynamic performance with CFD.',
    // ],
    // media: null,
    // pdf: null,
    // pdfLabel: 'Report — coming soon',
  // },
];