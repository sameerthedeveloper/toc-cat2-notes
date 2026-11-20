const Q = (m, q, a) => ({ m, q, a });

export const T5 = [
  {
    id: 'm5-1', mod: 'm5', title: 'Storage virtualization', pr: 'Very High',
    tags: 'storage virtualization virtual disk vmdk vhd vhdx qcow2 datastore vmfs nfs csv smb vsan san nas thick thin differencing provisioning migration shared nothing',
    body: `
<div class="def"><b>Definition.</b> Storage virtualization abstracts the physical storage devices, such as disks, RAID arrays, SAN LUNs and NAS shares, so that virtual machines see simple <b>virtual disks</b>, while the hypervisor and the storage system decide where the data is actually kept.</div>
<p>The guest operating system sees an ordinary SCSI, SATA or NVMe disk. In reality the disk is a <b>file</b> (VMDK, VHD/VHDX or qcow2) stored on a <b>datastore</b>, which is a volume formatted with a file system that the hypervisor understands: <b>VMFS or NFS</b> in VMware, <b>NTFS/ReFS with Cluster Shared Volumes (CSV) or an SMB share</b> in Hyper-V, and <b>storage pools</b> in KVM. VMware <b>vSAN</b> pools the local disks of several hosts into one shared datastore.</p>
<div data-w="diag:stor"></div>
<h2>SAN and NAS</h2>
<table><tr><th></th><th>SAN</th><th>NAS</th></tr>
<tr><td><b>Access level</b></td><td>Block level; the host sees a raw disk (LUN)</td><td>File level; the host sees a shared folder</td></tr>
<tr><td><b>Protocols</b></td><td>Fibre Channel, iSCSI, FCoE</td><td>NFS, SMB</td></tr>
<tr><td><b>Network</b></td><td>Dedicated FC fabric, or IP network for iSCSI</td><td>Ordinary IP network</td></tr>
<tr><td><b>Use with VMs</b></td><td>VMFS datastore or CSV on a LUN</td><td>NFS datastore, or Hyper-V VMs on an SMB share</td></tr>
<tr><td><b>Characteristics</b></td><td>High performance, more complex and costly</td><td>Easier to set up and manage</td></tr></table>
<h2>Virtual disk formats</h2>
<p>VMDK (VMware), VHD and VHDX (Hyper-V) and qcow2 (KVM). <b>VHD is limited to 2 TB</b>, whereas <b>VHDX supports up to 64 TB</b>, is more resistant to corruption and can be resized while in use.</p>
<h2>Provisioning: thick, thin and differencing</h2>
<table><tr><th></th><th>Thick (fixed) provisioning</th><th>Thin (dynamically expanding)</th></tr>
<tr><td><b>Space</b></td><td>Whole size allocated at creation</td><td>Allocated on demand</td></tr>
<tr><td><b>Performance</b></td><td>Predictable, best for databases</td><td>Slight overhead while growing</td></tr>
<tr><td><b>Efficiency</b></td><td>Unused space is wasted</td><td>Saves capacity</td></tr>
<tr><td><b>Risk</b></td><td>None of over-allocation</td><td>Datastore can be over-allocated and run full</td></tr></table>
<p>A third kind, the <b>differencing disk</b> (the delta file of a snapshot or linked clone), stores only the changes made to a parent disk; long chains of such disks slow down I/O.</p>
<div class="ex"><b>Example.</b> Ten thin disks of 100 GB that hold 30 GB each need only 300 GB of real space, although 1000 GB has been allocated, so the datastore must be monitored.</div>
<div data-w="thin"></div>
<h2>Storage and migration</h2>
<ul><li><b>Shared-storage migration:</b> the disks stay on a datastore that both hosts can reach, and only the <b>memory and device state</b> of the running VM are moved.</li><li><b>Shared-nothing migration</b> (vMotion with storage migration, Hyper-V Shared Nothing Live Migration, KVM migration with disk copy): the virtual disks are <b>copied over the network</b> as well, which takes longer.</li><li>Shared storage is therefore <b>not always necessary for live migration</b>, but it is <b>required for HA restart</b>.</li></ul>`,
    qa: [
      Q(2, 'Define storage virtualization.', 'Hiding physical storage behind logical virtual disks that are presented to the VMs.'),
      Q(2, 'Differentiate thick and thin provisioning.', 'Thick allocates the whole disk at creation; thin allocates space only as data is written.'),
      Q(2, 'How does VHDX differ from VHD?', 'VHD is limited to 2 TB; VHDX supports 64 TB, resists corruption better and can be resized online.'),
      Q(2, 'Differentiate SAN and NAS.', 'A SAN gives block-level access to LUNs; a NAS gives file-level access to shared folders.'),
      Q(5, 'Explain the layers of storage virtualization.', 'The guest sees an ordinary SCSI, SATA or NVMe disk. The hypervisor presents this disk as a virtual disk file (VMDK, VHD/VHDX or qcow2) stored on a datastore, which is a volume with a virtualization-aware file system such as VMFS, NFS, CSV or an SMB share. The datastore itself is built on physical storage: local disks, SAN LUNs reached through Fibre Channel or iSCSI, NAS shares or hyper-converged pools such as vSAN. Each layer hides the details of the layer below. This makes thin provisioning, snapshots, migration and central backup possible, but it also means that many VMs depend on the same storage and may compete for I/O.'),
      Q(5, 'Compare thick, thin and differencing virtual disks.', 'A thick (fixed) disk reserves all its space on creation and gives predictable performance, so it suits databases. A thin (dynamically expanding) disk takes space only as data is written; it saves capacity but may over-allocate the datastore, which must therefore be monitored. A differencing disk, such as a snapshot delta or linked clone, records only the changes made to a parent disk; it is useful for rollback and quick cloning, but long chains reduce performance. For example, ten thin disks of 100 GB with 30 GB of data each occupy 300 GB although 1000 GB is allocated.'),
      Q(13, 'Explain storage virtualization, VM storage options, tuning practices and the role of storage in migration.', '<p><b>Storage virtualization.</b> Physical storage is hidden behind virtual disks stored on datastores (draw the layers figure). Shared storage is provided by a SAN (block level, Fibre Channel or iSCSI) or a NAS (file level, NFS or SMB); hyper-converged systems such as vSAN pool local disks.</p><p><b>Disk types and formats.</b> Thick disks reserve all space and give predictable performance; thin disks allocate on demand and save capacity but can over-allocate the datastore; differencing disks hold only changes. Formats are VMDK, VHD/VHDX (2 TB and 64 TB limits) and qcow2.</p><p><b>Configuration.</b> Provisioning type and format, controller (paravirtual controllers are fastest), disk mode in VMware, placement or policy, and I/O shares or limits (Storage I/O Control, Storage QoS).</p><p><b>Tuning.</b> Use paravirtual controllers, thick disks for databases, separate data and log disks, multipathing and I/O control; remove old snapshots; monitor latency (GAVG = DAVG + KAVG) and the free space of thin datastores.</p><p><b>Migration.</b> With shared storage only the memory and device state are moved. In shared-nothing migration the disks are also copied over the network, so shared storage is not always needed for live migration but is needed for HA restart.</p><p><b>Conclusion.</b> Storage virtualization gives flexibility, thin provisioning and mobility, at the risk of I/O contention and a common point of failure; correct disk type, controller and monitoring keep VMs responsive.</p>'),
    ],
  },
  {
    id: 'm5-2', mod: 'm5', title: 'Configuring VM storage options', pr: 'High',
    tags: 'configuring vm storage options provisioning format virtual controller pvscsi virtio disk mode independent persistent non persistent datastore storage policy io control raw device mapping pass through',
    body: `
<p>When a disk is added to a VM, the following choices have to be made.</p>
<ul>
<li><b>Provisioning and format</b> – thick, thin or differencing disk; VMDK, VHD/VHDX or qcow2.</li>
<li><b>Virtual controller</b> – the <b>paravirtual</b> controllers (PVSCSI in VMware, virtio-blk or virtio-scsi in KVM, the SCSI controller of Hyper-V) are faster than emulated IDE or LSI controllers. In Hyper-V, generation 1 VMs boot from IDE, and generation 2 VMs use SCSI.</li>
<li><b>Disk mode (VMware)</b> – <b>dependent</b> disks follow snapshots; <b>independent persistent</b> disks keep their data but are excluded from snapshots; <b>independent non-persistent</b> disks discard their changes at power-off.</li>
<li><b>Datastore or storage policy</b> – where the disk is placed and the performance or protection level it requires.</li>
<li><b>I/O controls</b> – shares and IOPS limits (<b>Storage I/O Control</b> in VMware, <b>Storage QoS</b> in Hyper-V) to stop one VM from monopolising the storage.</li>
<li><b>Raw device mapping or pass-through disk</b> – gives the VM direct access to a LUN or physical disk for special cases, at the cost of some features.</li></ul>
<table><tr><th>Platform</th><th>How a disk is added</th></tr>
<tr><td>VMware</td><td>Edit Settings → Add New Device → Hard Disk</td></tr>
<tr><td>Hyper-V</td><td>New Virtual Hard Disk wizard, attached to a SCSI controller of the VM</td></tr>
<tr><td>KVM</td><td>Created with <code>qemu-img</code> and attached with <code>virsh</code></td></tr></table>`,
    qa: [
      Q(2, 'Name the VMware disk modes.', 'Dependent (follows snapshots), independent persistent (keeps data, excluded from snapshots) and independent non-persistent (discards changes at power-off).'),
      Q(5, 'Explain the choices made when adding a disk to a VM.', 'Provisioning and format, virtual controller (paravirtual is faster), disk mode, datastore or policy, I/O controls, and raw device mapping or pass-through; how it is done in VMware, Hyper-V and KVM.'),
    ],
  },
  {
    id: 'm5-3', mod: 'm5', title: 'Tuning practices for VM storage', pr: 'High',
    tags: 'tuning practices vm storage paravirtual controllers thick disks ssd nvme separate workloads multipathing snapshots latency gavg davg kavg thin provisioned',
    body: `
<ul>
<li>Use <b>paravirtual controllers</b>, which need less CPU and give lower latency.</li>
<li>Use <b>thick or fixed disks</b> for latency-sensitive workloads such as databases, and place heavy I/O VMs on SSD or NVMe storage.</li>
<li><b>Separate workloads:</b> keep the operating system, database and log disks on different datastores or LUNs so that they do not compete.</li>
<li>Use <b>multipathing</b> for redundancy and load balancing, and storage I/O control or QoS against noisy neighbours.</li>
<li><b>Delete snapshots</b> that are no longer needed. Long snapshot chains slow I/O and consume space, and <b>a snapshot is not a backup</b>.</li>
<li><b>Monitor latency.</b> In VMware the guest latency <b>GAVG = DAVG + KAVG</b> (device latency plus kernel latency); sustained values above roughly <b>20 to 30 ms</b> are a common warning sign. Also watch the free space of thin-provisioned datastores.</li></ul>
<div data-w="latency"></div>
<div class="warn"><b>Diagnosis.</b> High latency usually means that too many busy VMs share one LUN. The remedy is to move some of them to another datastore, add faster media or enable I/O control. A VM that <b>pauses suddenly</b> may have run out of datastore space.</div>`,
    qa: [
      Q(2, 'How is VMware guest latency made up?', 'GAVG (guest latency) = DAVG (device latency) + KAVG (kernel latency); sustained values above about 20 to 30 ms are a warning sign.'),
      Q(5, 'List the practices for tuning VM storage.', 'Paravirtual controllers, thick disks and fast media for latency-sensitive loads, separate OS, data and log disks, multipathing and I/O control, delete old snapshots (not a backup), monitor latency and free space of thin datastores.'),
    ],
  },
  {
    id: 'm5-4', mod: 'm5', title: 'Network virtualization', pr: 'Very High',
    tags: 'network virtualization vnic virtual switch port group vlan uplink standard distributed vswitch hyper-v external internal private switch linux bridge open vswitch vmxnet3 virtio-net',
    body: `
<div class="def"><b>Definition.</b> Network virtualization implements network components in software. Each VM is given one or more <b>virtual network adapters (vNICs)</b>, which connect to <b>virtual switches</b> that forward traffic between VMs on the same host and, through physical NICs called <b>uplinks</b>, to the physical network.</div>
<div data-w="diag:vswitch"></div>
<p>A virtual switch works like a physical Ethernet switch but exists in the <b>memory of the host</b>. Traffic between two VMs on the same switch and host <b>never leaves the host</b>. The ports of a switch are collected in <b>port groups</b>, each with its own VLAN ID and policies. A <b>VLAN</b> divides a network into separate broadcast domains, so that VMs on different VLANs cannot see one another's traffic although they share the same physical switch. Several uplinks can be <b>teamed</b> for redundancy and bandwidth. The host's own services, such as management, live migration and storage access, use virtual adapters on the same switches.</p>
<table><tr><th>Platform</th><th>Switch types</th></tr>
<tr><td>VMware</td><td>Standard vSwitch and distributed vSwitch</td></tr>
<tr><td>Hyper-V</td><td>External, internal and private switches</td></tr>
<tr><td>KVM</td><td>Linux bridge or Open vSwitch</td></tr></table>
<h2>Standard versus distributed virtual switch</h2>
<table><tr><th></th><th>Standard virtual switch</th><th>Distributed virtual switch</th></tr>
<tr><td><b>Scope</b></td><td>One host; configured separately on each host</td><td>Many hosts; configured once in vCenter</td></tr>
<tr><td><b>Features</b></td><td>Basic switching, VLANs, teaming, security policies</td><td>Adds central management, port mirroring, NetFlow, private VLANs and network I/O control</td></tr>
<tr><td><b>Consistency</b></td><td>Settings may differ between hosts</td><td>Same configuration on every host, which simplifies migration</td></tr></table>
<h2>Hyper-V switch types</h2>
<ul><li><b>External</b> switch: bound to a physical NIC and gives VMs access to the LAN.</li><li><b>Internal</b> switch: connects the VMs with the host only.</li><li><b>Private</b> switch: connects the VMs with each other only.</li></ul>
<p>For better performance the <b>paravirtual adapters</b> VMXNET3 (VMware), the synthetic adapter (Hyper-V) and virtio-net (KVM) are preferred to emulated adapters such as E1000.</p>`,
    qa: [
      Q(2, 'What is a port group?', 'A group of virtual switch ports that share a VLAN ID and common policies.'),
      Q(2, 'What is a VLAN?', 'A logical division of a network into separate broadcast domains.'),
      Q(2, 'Name the three Hyper-V virtual switch types.', 'External, internal and private.'),
      Q(5, 'Distinguish standard and distributed virtual switches and describe the Hyper-V switch types.', 'A standard vSwitch exists on a single host and has to be configured separately on every host, so settings may differ. A distributed vSwitch is created once in vCenter and spans all hosts of a cluster; it keeps the configuration consistent and adds port mirroring, NetFlow, private VLANs and network I/O control, which simplifies migration of VMs. Hyper-V provides external switches bound to a physical NIC for access to the LAN, internal switches for communication between the VMs and the host, and private switches for communication between VMs only.'),
    ],
  },
  {
    id: 'm5-5', mod: 'm5', title: 'Configuring VM network options', pr: 'High',
    tags: 'configuring vm network options virtual switch port group vlan id adapter type mac address teaming failover traffic shaping mtu jumbo frames security policies sr-iov vmq paravirtual',
    body: `
<p>To connect a VM to a network the administrator selects the following.</p>
<ul>
<li><b>Virtual switch and port group</b>, which decide the network the vNIC joins.</li>
<li><b>VLAN ID</b> of the port group (or of the adapter in Hyper-V), which tags the VM's traffic.</li>
<li><b>Adapter type</b> – VMXNET3, synthetic or virtio-net for performance.</li>
<li><b>MAC address</b> – automatic or fixed; a fixed address helps with DHCP reservations and software licences.</li>
<li><b>Teaming and failover</b> – several uplinks with a load-balancing and failover policy.</li>
<li><b>Traffic shaping or bandwidth limits</b>, and the <b>MTU</b> (for example 9000 bytes for jumbo frames).</li>
<li><b>Security policies</b> (next sections) and, for demanding workloads, <b>SR-IOV or VMQ</b> for direct or queued hardware access.</li></ul>
<table><tr><th>Platform</th><th>How</th></tr>
<tr><td>VMware</td><td>Create a port group on the switch and attach the VM's network adapter to it under Edit Settings</td></tr>
<tr><td>Hyper-V</td><td>Create a virtual switch in the Virtual Switch Manager and connect the VM's network adapter to it, with a VLAN ID if required</td></tr>
<tr><td>KVM</td><td>Attach an interface to a bridge or a libvirt network</td></tr></table>`,
    qa: [
      Q(2, 'Why are paravirtual adapters preferred?', 'They give higher throughput at lower CPU cost than emulated adapters.'),
      Q(5, 'List the network options configured for a VM.', 'Switch and port group, VLAN ID, adapter type (VMXNET3, synthetic, virtio-net), MAC address, teaming and failover, traffic shaping and MTU, security policies, SR-IOV or VMQ.'),
    ],
  },
  {
    id: 'm5-6', mod: 'm5', title: 'Tuning practices for virtual networks', pr: 'Very High',
    tags: 'tuning practices virtual networks paravirtual adapter separate traffic types nic teaming jumbo frames mtu affinity rules offloads vmq sr-iov network io control dropped packets',
    body: `
<ul>
<li>Use the <b>paravirtual adapter</b> with the guest tools installed.</li>
<li><b>Separate the traffic types</b> (VM traffic, management, live migration, storage) onto different VLANs or uplinks, so that migration or storage traffic cannot starve the VMs.</li>
<li>Use <b>NIC teaming</b> and sufficiently fast uplinks (10 Gb Ethernet or more for dense hosts).</li>
<li>Enable <b>jumbo frames</b> only if every device on the path, from the guest to the physical switch, uses the same MTU.</li>
<li>Keep VMs that communicate heavily on the <b>same host</b> (using affinity rules), because their traffic then stays in memory.</li>
<li>Use <b>hardware offloads, VMQ</b> and, for very high I/O, <b>SR-IOV</b>; apply network I/O control to guarantee bandwidth.</li></ul>
<table><tr><th>Symptom</th><th>Likely cause</th></tr>
<tr><td>Dropped packets or poor throughput</td><td>An emulated adapter, small buffers or a saturated uplink</td></tr>
<tr><td>VM without connectivity</td><td>A wrong VLAN ID, a wrong port group or a disconnected vNIC</td></tr></table>`,
    qa: [
      Q(2, 'When may jumbo frames be enabled?', 'Only if every device on the path, from the guest to the physical switch, uses the same MTU.'),
      Q(5, 'List the tuning practices for virtual networks.', 'Paravirtual adapters with guest tools, separate traffic types, NIC teaming and fast uplinks, jumbo frames only with identical MTU, keep chatty VMs on one host, offloads, VMQ, SR-IOV and network I/O control.'),
      Q(13, 'Explain network virtualization, the configuration of VM network options and the tuning of virtual networks.', '<p><b>Network virtualization.</b> VMs connect through vNICs to virtual switches, whose ports are organised in port groups with VLAN IDs; uplinks (teamed physical NICs) connect the switch to the physical network (draw the virtual switch figure). VMware has standard and distributed switches, Hyper-V has external, internal and private switches, and KVM uses a Linux bridge or Open vSwitch. The distributed switch is managed centrally for many hosts.</p><p><b>Configuration.</b> Choose the switch and port group, VLAN ID, adapter type (VMXNET3, synthetic or virtio-net), MAC address, teaming and failover, traffic shaping, MTU and security policies; SR-IOV or VMQ may be used for high performance.</p><p><b>Tuning.</b> Use paravirtual adapters, separate traffic types (VM, management, migration, storage), team uplinks, use jumbo frames only with an identical MTU along the whole path, keep communicating VMs on one host and use offloads and network I/O control.</p><p><b>Common problems.</b> Dropped packets suggest an emulated adapter or saturated uplink; lack of connectivity suggests a wrong VLAN or port group.</p><p><b>Conclusion.</b> Careful design and paravirtual adapters give fast and isolated connectivity.</p>'),
    ],
  },
  {
    id: 'm5-7', mod: 'm5', title: 'Deploying applications in a virtual environment', pr: 'High',
    tags: 'deploying applications virtual environment p2v template clone sizing workload assessment ha backup anti-affinity vdi linked clones snapshots vm sprawl server consolidation',
    body: `
<div class="def"><b>Definition.</b> Deploying an application in a virtual environment means planning, building and operating it on virtual machines so that it receives the resources, availability and protection it needs while sharing the host efficiently.</div>
<h2>Steps</h2>
<ol>
<li><b>Assess</b> the existing workload: its CPU, memory, disk and network use, including peaks, to decide whether it is suitable for virtualization.</li>
<li><b>Size</b> the VM from the measured data, not from the specification of the old physical server.</li>
<li><b>Create</b> the VM from a template or clone, or convert an existing physical server into a VM (<b>P2V</b>).</li>
<li><b>Configure</b> the CPU, memory, storage and network options, install the guest tools and secure the operating system.</li>
<li><b>Install</b> the application, following the vendor's guidelines for virtual platforms and licensing; keep the data on separate virtual disks.</li>
<li><b>Protect</b> the application with HA clustering, backups of the VM and anti-affinity rules for redundant servers, then <b>test and monitor</b> it.</li></ol>
<h2>Different workloads</h2>
<table><tr><th>Workload</th><th>Approach</th></tr>
<tr><td>Web or application server</td><td>Few vCPUs; scaled by adding more VMs behind a load balancer</td></tr>
<tr><td>Database</td><td>Reserved CPU and memory, fits in one NUMA node, fast storage with separate data and log disks</td></tr>
<tr><td>Virtual desktops (VDI)</td><td>Linked clones, thin disks and fast storage to survive boot storms</td></tr></table>
<p>Snapshots are suitable for <b>short-term rollback only</b>, and unused VMs should be removed to avoid <b>VM sprawl</b>. Typical applications of virtualization are <b>server consolidation, test and development labs, private clouds, VDI and disaster recovery</b>.</p>`,
    qa: [
      Q(2, 'What is P2V?', 'Converting a physical server into a virtual machine.'),
      Q(5, 'Explain the steps in deploying an application in a virtual environment.', 'The workload is first assessed by measuring its CPU, memory, I/O and network use. The VM is then sized from these measurements and created from a template, a clone or by P2V conversion. CPU, memory, storage and network options are configured, guest tools are installed and the operating system is patched. The application is installed according to vendor guidelines and licensing rules, with data kept on separate disks. Finally the application is protected by HA, backups and anti-affinity rules, tested for performance and failover, and monitored so that the sizing can be corrected.'),
    ],
  },
  {
    id: 'm5-8', mod: 'm5', title: 'Designing virtual networks for security', pr: 'Very High',
    tags: 'designing virtual networks security segmentation firewalls micro-segmentation vlan promiscuous mode mac address changes forged transmits dhcp guard router guard infrastructure networks',
    body: `
<p>Virtual machines of different trust levels share the same physical hosts, so security must be built into the design of the virtual network. The main principle is to <b>isolate networks by function and trust level</b> and to allow <b>only the traffic that is required</b>.</p>
<div data-w="diag:secnet"></div>
<ul>
<li><b>Segmentation</b> – put the web, application and database tiers in separate VLANs or port groups, and do not mix trusted and untrusted VMs on one network.</li>
<li><b>Firewalls</b> – use a perimeter firewall and, between the VMs of the same host, a distributed firewall (<b>micro-segmentation</b>) or port ACLs.</li>
<li><b>Separate infrastructure networks</b> – keep management, live migration and storage traffic on isolated, <b>non-routable</b> networks, and encrypt migration traffic where possible.</li>
<li><b>Switch policies</b> – secure the virtual switch and remove unused port groups and uplinks; in Hyper-V use <b>DHCP guard and router guard</b>.</li>
<li><b>Administration</b> – allow only authorised administrators to change the network, and log such changes.</li></ul>
<h2>VMware virtual switch security policies</h2>
<table><tr><th>Policy</th><th>Meaning</th></tr>
<tr><td><b>Promiscuous mode</b></td><td>A VM may see all frames of the port group</td></tr>
<tr><td><b>MAC address changes</b></td><td>A guest may change its MAC address</td></tr>
<tr><td><b>Forged transmits</b></td><td>Frames with a different source MAC may leave the VM</td></tr></table>
<p>The recommended hardening setting is <b>Reject</b> for all three, unless a workload such as network load balancing needs otherwise. Promiscuous mode is Reject by default, but the defaults of the other two differ between vSphere versions and switch types, so they should be checked in the environment used.</p>`,
    qa: [
      Q(2, 'Name the three VMware virtual switch security policies.', 'Promiscuous mode, MAC address changes and forged transmits; the hardening setting is Reject for all three unless a workload needs otherwise.'),
      Q(5, 'Explain how a virtual network is designed for security.', 'Segmentation of tiers into VLANs, perimeter and distributed firewalls (micro-segmentation), separate non-routable management, migration and storage networks with encrypted migration traffic, secured switch policies and removal of unused port groups and uplinks, authorised and logged administration.'),
      Q(13, 'Discuss the design of secure virtual networks and the securing of the hypervisor.', '<p><b>Secure network design.</b> Isolate the tiers of an application in separate VLANs (draw the secure network figure), protect them with perimeter and distributed firewalls, keep management, migration and storage traffic on separate non-routable networks and remove unused port groups and uplinks. In a VMware switch the policies promiscuous mode, MAC address changes and forged transmits should be set to Reject unless a workload needs otherwise; their defaults vary between versions, so they must be verified. Hyper-V adds DHCP guard, router guard and port ACLs.</p><p><b>Hypervisor threats.</b> VM escape, hyperjacking, compromise of management interfaces, side-channel attacks, unpatched or sprawling VMs and denial of service.</p><p><b>Hardening.</b> Regular patching, minimal services and host firewall, lockdown mode, role-based access with multi-factor authentication, secure boot and TPM attestation, Shielded VMs (Hyper-V) and sVirt (KVM), encryption of VMs and migration traffic, central logging, removal of unused devices and use of vendor hardening guides.</p><p><b>Conclusion.</b> Network segmentation and hypervisor hardening complement each other; together they protect all VMs on the host.</p>'),
    ],
  },
  {
    id: 'm5-9', mod: 'm5', title: 'Securing the hypervisor', pr: 'Very High',
    tags: 'securing hypervisor vm escape hyperjacking management interface side channel spectre patching attack surface lockdown mode role based access multi factor secure boot tpm shielded vms svirt encryption',
    body: `
<p>The hypervisor controls every VM on the host, so its compromise exposes all of them. Hypervisor security therefore means <b>reducing its attack surface</b> and <b>protecting its management</b>.</p>
<h2>Main threats</h2>
<ul>
<li><b>VM escape</b> – a malicious VM breaks out of its isolation and reaches the host or other VMs.</li>
<li><b>Hyperjacking</b> – a rogue hypervisor is installed beneath the operating system.</li>
<li><b>Compromise of the management interface</b> – an attacker gains administrative control of the hosts.</li>
<li><b>Side-channel attacks</b> – shared processor caches leak data between VMs (Spectre-type attacks).</li>
<li><b>VM sprawl and unpatched VMs</b>, and <b>denial of service</b> by a VM that uses up the host's resources.</li></ul>
<h2>Protective measures</h2>
<ul>
<li><b>Apply patches</b> regularly to the hypervisor, firmware and management servers.</li>
<li><b>Reduce the attack surface:</b> disable services that are not needed (for example remote shell access), close ports with the host firewall, and use lockdown mode in ESXi or Hyper-V on Server Core.</li>
<li>Use <b>role-based access</b>, a central directory with <b>multi-factor authentication</b>, and an <b>isolated management network</b>.</li>
<li>Use <b>secure boot and a TPM</b> for attestation; Hyper-V provides <b>Shielded VMs</b>, and KVM on Red Hat uses <b>SELinux (sVirt)</b> to isolate each VM process.</li>
<li><b>Encrypt</b> VMs and migration traffic, keep central logs, and remove unused virtual devices from the guests.</li>
<li>Follow the vendor's <b>hardening guides</b>, and use limits, shares and QoS to prevent resource exhaustion.</li></ul>
<div class="tip"><b>Note.</b> Version-specific behaviour (vNUMA thresholds, default switch security policies, scheduler defaults) differs between product releases and should be checked against the version in use.</div>`,
    qa: [
      Q(2, 'What is VM escape?', 'An attack in which a guest breaks out of its isolation and reaches the hypervisor or other VMs.'),
      Q(2, 'What is hyperjacking?', 'Installing a rogue hypervisor beneath the operating system.'),
      Q(5, 'Explain the measures used to secure a hypervisor.', 'Because the hypervisor controls all VMs, it is first kept patched and its attack surface is reduced by disabling unneeded services and closing ports. Access is limited by role-based permissions, multi-factor authentication and lockdown mode, and the management interfaces sit on an isolated network. Secure boot and a TPM allow the host to be attested, Hyper-V Shielded VMs and KVM sVirt isolate VMs further, and VM and migration traffic can be encrypted. Logs are kept centrally, unused virtual devices are removed, and vendor hardening guides are followed.'),
    ],
  },
  {
    id: 'cmp-1', mod: 'cmp', title: 'Exam comparisons', pr: 'Very High',
    tags: 'comparison compare difference full virtualization paravirtualization hardware assisted reservation limit shares shadow nested paging thick thin differencing san nas standard distributed switch hyper-v ballooning',
    body: `
<h2>Three CPU virtualization techniques</h2>
<table><tr><th></th><th>Binary translation</th><th>Paravirtualization</th><th>Hardware-assisted</th></tr><tr><td>Guest OS</td><td>Unmodified</td><td>Modified (hypercalls)</td><td>Unmodified</td></tr><tr><td>Privileged instructions</td><td>Rewritten at run time</td><td>Hypercalls</td><td>VM exit</td></tr><tr><td>Example</td><td>Early ESX</td><td>Xen PV</td><td>ESXi, Hyper-V, KVM</td></tr></table>
<h2>Reservation, limit and shares</h2>
<table><tr><th></th><th>Reservation</th><th>Limit</th><th>Shares</th></tr><tr><td>Meaning</td><td>Guaranteed minimum</td><td>Upper cap</td><td>Relative priority</td></tr><tr><td>Active when</td><td>Always (checked at power-on)</td><td>Always, even if host is idle</td><td>Only under contention</td></tr></table>
<h2>Shadow page tables and nested paging</h2>
<table><tr><th></th><th>Shadow page tables</th><th>Nested paging</th></tr><tr><td>Done by</td><td>Hypervisor software</td><td>CPU hardware (EPT, NPT/RVI)</td></tr><tr><td>Guest updates</td><td>Trapped</td><td>Not trapped</td></tr></table>
<h2>Memory reclamation techniques</h2>
<table><tr><th></th><th>Page sharing</th><th>Ballooning</th><th>Compression</th><th>Hypervisor swapping</th></tr><tr><td>Idea</td><td>Store identical pages once</td><td>Guest driver frees pages</td><td>Compress instead of swap</td><td>Write VM memory to disk</td></tr><tr><td>Guest aware</td><td>No</td><td>Yes (driver)</td><td>No</td><td>No</td></tr></table>
<h2>Thick, thin and differencing disks</h2>
<table><tr><th></th><th>Thick</th><th>Thin</th><th>Differencing</th></tr><tr><td>Space</td><td>All at creation</td><td>On demand</td><td>Only changes to parent</td></tr><tr><td>Best for</td><td>Databases</td><td>Saving capacity</td><td>Rollback, linked clones</td></tr></table>
<h2>SAN and NAS</h2>
<table><tr><th></th><th>SAN</th><th>NAS</th></tr><tr><td>Level</td><td>Block (LUN)</td><td>File (share)</td></tr><tr><td>Protocols</td><td>Fibre Channel, iSCSI, FCoE</td><td>NFS, SMB</td></tr></table>
<h2>Standard and distributed vSwitch</h2>
<table><tr><th></th><th>Standard</th><th>Distributed</th></tr><tr><td>Scope</td><td>One host</td><td>Many hosts (vCenter)</td></tr><tr><td>Settings</td><td>May differ per host</td><td>Consistent</td></tr></table>
<h2>Hyper-V switches</h2>
<table><tr><th>External</th><th>Internal</th><th>Private</th></tr><tr><td>VMs to LAN</td><td>VMs and host only</td><td>VMs only</td></tr></table>
<h2>VHD and VHDX</h2>
<table><tr><th></th><th>VHD</th><th>VHDX</th></tr><tr><td>Maximum size</td><td>2 TB</td><td>64 TB</td></tr><tr><td>Corruption resistance, online resize</td><td>No</td><td>Yes</td></tr></table>`,
    qa: [
      Q(5, 'Compare shadow page tables and nested paging.', 'Use the shadow page tables and nested paging table above.'),
      Q(5, 'Compare thick, thin and differencing virtual disks.', 'Use the thick, thin and differencing table above, with the 300 GB of 1000 GB thin example.'),
    ],
  },
];
