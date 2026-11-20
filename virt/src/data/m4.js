const Q = (m, q, a) => ({ m, q, a });

export const T4 = [
  {
    id: 'm4-1', mod: 'm4', title: 'CPU virtualization', pr: 'Very High',
    tags: 'cpu virtualization vcpu hypervisor full virtualization binary translation paravirtualization hardware assisted vt-x amd-v vm exit root mode overcommitment cpu ready',
    body: `
<div class="def"><b>Definition.</b> CPU virtualization is the technique by which a hypervisor gives each virtual machine one or more <b>virtual CPUs (vCPUs)</b> and schedules them on the physical processors, while keeping the virtual machines <b>isolated</b> from one another. The guest operating system behaves as if it owned the processor, although it actually receives only <b>time slices</b> of a physical logical processor.</div>
<div data-w="diag:cpu"></div>
<h2>The problem: privileged instructions</h2>
<p>A guest kernel expects to run in the most privileged mode of the CPU, but if it were allowed to do so it could take control of the whole machine. The hypervisor must therefore <b>intercept</b> such instructions and <b>emulate</b> them safely. Three approaches are used.</p>
<table><tr><th></th><th>Full virtualization (binary translation)</th><th>Paravirtualization</th><th>Hardware-assisted virtualization</th></tr>
<tr><td><b>Guest OS</b></td><td>Unmodified</td><td>Modified to make hypercalls</td><td>Unmodified</td></tr>
<tr><td><b>Privileged instructions</b></td><td>Rewritten by the hypervisor at run time</td><td>Replaced by hypercalls in the guest kernel</td><td>CPU transfers control to the hypervisor (VM exit)</td></tr>
<tr><td><b>Performance</b></td><td>Good, with translation overhead</td><td>Good, but needs guest support</td><td>Best; used by current hypervisors</td></tr>
<tr><td><b>Example</b></td><td>Early VMware ESX</td><td>Xen PV guests</td><td>ESXi, Hyper-V, KVM on Intel VT-x / AMD-V</td></tr></table>
<h2>Hardware-assisted virtualization</h2>
<p>The processor provides two modes: <b>root mode</b> for the hypervisor and <b>non-root mode</b> for the guest. When the guest attempts a sensitive operation, a <b>VM exit</b> passes control to the hypervisor, which emulates the operation and resumes the guest (a VM entry).</p>
<div class="warn"><b>Do not confuse.</b> Paravirtualized I/O drivers such as <b>virtio</b> and <b>VMXNET3</b> are not CPU paravirtualization. They only speed up disk and network access and are used together with hardware-assisted CPU virtualization.</div>
<h2>Scheduling and overcommitment</h2>
<ul><li>Each vCPU is scheduled much like a thread. The hypervisor scheduler allots time slices of the logical processors to the vCPUs, respecting the <b>reservation, limit and shares</b> set for each VM (next topic).</li><li>The total number of vCPUs on a host may exceed the number of physical cores. This is <b>CPU overcommitment</b>.</li><li>If more vCPUs are ready to run than there are processors, some must wait. VMware calls this waiting time <b>CPU Ready</b>.</li><li>In Hyper-V the management operating system is the <b>root partition</b>, each VM is a <b>child partition</b>, and the hypervisor schedules the virtual processors on the logical processors.</li></ul>
<div class="ex"><b>Example.</b> A host with two 8-core processors has 16 cores. Ten VMs with 4 vCPUs each use 40 vCPUs, a ratio of 2.5 vCPUs per core, which is acceptable only if the VMs are lightly loaded.</div>
<div data-w="cpu"></div>`,
    qa: [
      Q(2, 'What is CPU virtualization?', 'Presenting virtual CPUs to VMs and scheduling them on physical processors while keeping the VMs isolated.'),
      Q(2, 'Name the three techniques of CPU virtualization.', 'Full virtualization with binary translation, paravirtualization and hardware-assisted virtualization.'),
      Q(2, 'What is CPU Ready time?', 'The time a vCPU is ready to run but waits for a physical processor; high values indicate contention.'),
      Q(5, 'Explain hardware-assisted CPU virtualization.', 'Classic x86 processors could not trap every privileged instruction, so early hypervisors had to rewrite guest code by binary translation. Intel VT-x and AMD-V add a new execution mode. The hypervisor runs in root mode, and the guest, including its kernel, runs in non-root mode. When the guest performs a sensitive operation, the processor causes a VM exit and passes control to the hypervisor, which emulates the operation and resumes the guest by a VM entry. The state of the guest and of the host is saved in a control structure during each switch. The guest runs unmodified at near-native speed; the main cost is the number of VM exits. The feature must be enabled in the BIOS and is used by ESXi, Hyper-V and KVM.'),
      Q(13, 'Explain CPU virtualization: techniques, scheduling, configuration options and tuning.', '<p><b>Definition.</b> CPU virtualization presents vCPUs to VMs and schedules them on physical processors while keeping VMs isolated (draw the vCPU scheduling figure).</p><p><b>Techniques.</b> Binary translation rewrites privileged guest instructions at run time and needs no change in the guest. Paravirtualization modifies the guest kernel so that it issues hypercalls. Hardware-assisted virtualization uses root and non-root modes of Intel VT-x or AMD-V, and a VM exit transfers control to the hypervisor; it is the method used today. Paravirtualized I/O drivers (virtio, VMXNET3) are a separate matter and only accelerate devices.</p><p><b>Scheduling.</b> The scheduler gives time slices of the logical processors to the vCPUs according to reservation, limit and shares. The total vCPUs may exceed the cores (overcommitment); a vCPU waiting for a processor accumulates CPU Ready time.</p><p><b>Configuration.</b> Number of vCPUs, reservation (guaranteed MHz), limit (cap) and shares (relative priority) in VMware; virtual processors, reserve %, limit % and relative weight in Hyper-V; also hot add, affinity and a compatibility mode for migration.</p><p><b>Tuning.</b> Size from measured demand, watch CPU Ready and co-stop, avoid affinity and low limits, keep the VM within a NUMA node, install guest tools and keep reservations for critical VMs.</p><p><b>Conclusion.</b> Hardware assistance gives efficient CPU virtualization; performance then depends on sensible vCPU sizing and controlled overcommitment.</p>'),
    ],
  },
  {
    id: 'm4-2', mod: 'm4', title: 'Configuring VM CPU options', pr: 'High',
    tags: 'configuring vm cpu options vcpu reservation limit shares hot add affinity evc compatibility mode nested virtualization hyper-v reserve weight',
    body: `
<p>The CPU options of a virtual machine decide <b>how many vCPUs it receives</b> and <b>how it competes</b> with other VMs for processor time.</p>
<table><tr><th>Option</th><th>Meaning</th><th>Hyper-V equivalent</th></tr>
<tr><td><b>Number of vCPUs</b></td><td>Set as sockets × cores per socket in VMware</td><td>Number of virtual processors</td></tr>
<tr><td><b>Reservation</b></td><td>CPU capacity (in MHz) <b>guaranteed</b> to the VM. A VM cannot power on if the host cannot guarantee it.</td><td>Virtual machine reserve (%)</td></tr>
<tr><td><b>Limit</b></td><td>An <b>upper cap</b> on CPU use, enforced even when the host is idle.</td><td>Limit (%)</td></tr>
<tr><td><b>Shares</b></td><td><b>Relative priority</b>, which matters only when the CPU is contended. VMware: Low = 500, Normal = 1000, High = 2000 shares per vCPU.</td><td>Relative weight (default 100)</td></tr></table>
<p><b>Other options:</b> CPU hot add, CPU affinity, a compatibility mode (EVC in VMware) that allows migration between different CPU generations, and exposure of hardware virtualization to the guest for nested virtualization.</p>
<div class="ex"><b>Example.</b> If the CPU is contended, a VM with 2 vCPUs and Normal shares holds 2 × 1000 = 2000 shares, while a VM with 1 vCPU holds 1000, so the first receives about <b>twice</b> as much CPU time.</div>
<div data-w="shares"></div>
<div class="tip"><b>Remember.</b> Limits should be used <b>sparingly</b>, because they slow a VM down even when the host has spare capacity. Shares have no effect when the host is not contended.</div>
<p><b>Where to set them.</b> VMware: Edit Settings → Virtual Hardware → CPU. Hyper-V: VM Settings → Processor.</p>`,
    qa: [
      Q(2, 'Distinguish CPU reservation from CPU limit.', 'A reservation is a guaranteed minimum; a limit is a maximum that the VM cannot exceed.'),
      Q(2, 'What are shares?', 'Relative weights that decide how CPU or memory is divided among VMs, effective only under contention.'),
      Q(5, 'Explain CPU reservation, limit and shares with an example.', 'A reservation guarantees a minimum amount of CPU and is checked when the VM powers on. A limit places a ceiling on the CPU the VM may use, even if the host is idle. Shares give relative priority during contention only; in VMware each vCPU carries 500, 1000 or 2000 shares for Low, Normal and High. For example, if VM-A has 2 vCPUs and VM-B has 1 vCPU, both with Normal shares, then A holds 2000 and B 1000 shares and under contention A receives CPU time twice as often as B. Hyper-V offers the equivalent settings as reserve %, limit % and relative weight.'),
    ],
  },
  {
    id: 'm4-3', mod: 'm4', title: 'Tuning practices for VM CPUs', pr: 'High',
    tags: 'tuning practices vm cpu cpu ready co-stop numa affinity vmware tools integration services',
    body: `
<p>CPU tuning aims to give every VM the processing power it needs <b>without causing scheduling delays for others</b>.</p>
<ul>
<li><b>Size the VM from measured demand.</b> Begin with one or two vCPUs and add more only when usage stays high.</li>
<li><b>Monitor CPU utilisation together with CPU Ready and co-stop.</b> As a rule of thumb, a CPU Ready that stays above about <b>5% per vCPU</b> deserves investigation. Hyper-V provides similar hypervisor processor counters.</li>
<li><b>Avoid CPU affinity and low limits</b>, because they prevent the scheduler from balancing the load.</li>
<li><b>Keep a VM within one NUMA node</b> where possible, so that its memory access stays local.</li>
<li><b>Install VMware Tools or the Hyper-V Integration Services</b>, and use reservations or shares only for critical VMs.</li></ul>
<div class="warn"><b>Diagnosis.</b> A VM that feels slow although its own CPU usage is low is usually suffering from <b>high CPU Ready</b>. The remedy is to reduce its vCPUs, move other VMs away or add host capacity.</div>`,
    qa: [
      Q(2, 'Why does a VM with low CPU usage still feel slow?', 'It is probably waiting for a physical processor (high CPU Ready). Reduce its vCPUs, move other VMs away or add host capacity.'),
      Q(5, 'List the CPU tuning practices for virtual machines.', 'Size from measured demand, watch CPU Ready (above about 5% per vCPU) and co-stop, avoid affinity and low limits, keep the VM within a NUMA node, install the guest tools, and use reservations or shares only for critical VMs.'),
    ],
  },
  {
    id: 'm4-4', mod: 'm4', title: 'Choosing multiple CPUs', pr: 'High',
    tags: 'choosing multiple cpus virtual smp symmetric multiprocessing co-scheduling co-stop vnuma licensing vcpu sizing overcommitment',
    body: `
<div class="def"><b>Virtual SMP</b> (symmetric multiprocessing) allows one VM to use <b>more than one vCPU</b>, so that multi-threaded programs can run their threads in parallel. The guest OS and the application must support multiprocessing; a <b>single-threaded</b> application gains nothing from additional vCPUs.</div>
<p>A VM with <b>n vCPUs needs n logical processors</b>. VMware uses <b>relaxed co-scheduling</b>: the vCPUs need not run at the same instant, but a vCPU that runs too far ahead of its siblings is stopped for a while (<b>co-stop</b>). Larger VMs therefore wait longer and may run slower than smaller ones.</p>
<h2>Guidelines</h2>
<ul><li>Start with <b>one or two vCPUs</b>; add more only if usage is consistently high and CPU Ready is low.</li><li>A single VM should <b>not have more vCPUs than the host has physical cores</b> (hypervisors limit it to the number of logical processors), and should preferably fit inside <b>one NUMA node</b>.</li><li>Remember <b>licensing</b>: many products are licensed per core.</li></ul>
<p>This limit applies to <b>one VM</b>. The total vCPUs of all VMs may exceed the physical cores, because VMs rarely reach their peak together. How high the vCPU-to-core ratio can go depends on the workload and must be judged from measured CPU Ready rather than a fixed figure.</p>
<p>Very large VMs may be given a <b>virtual NUMA (vNUMA)</b> topology so that the guest can place memory efficiently; when this happens depends on the hypervisor version (older vSphere releases did it only above eight vCPUs).</p>
<div class="ex"><b>Example.</b> A lightly loaded web server needs only 2 vCPUs, whereas a database that runs parallel queries may justify 4 to 8 vCPUs.</div>
<div data-w="cpu"></div>`,
    qa: [
      Q(2, 'What is virtual SMP?', 'The ability of one VM to use more than one vCPU so that multi-threaded programs can run threads in parallel.'),
      Q(5, 'Discuss the factors in choosing the number of vCPUs for a VM and the role of Hyper-Threading.', 'Extra vCPUs help only multi-threaded applications. The usual method is to start with one or two vCPUs, observe the load and increase the number only if utilisation is high and CPU Ready is low. A VM should not exceed the physical cores of the host and should fit in one NUMA node. Oversized VMs wait longer for scheduling because of relaxed co-scheduling, and increase software licence costs. The total vCPUs of all VMs may exceed the physical cores (overcommitment) provided CPU Ready stays low. Hyper-Threading provides two logical processors per core, but the second thread adds only a limited gain, so host capacity should be calculated on physical cores.'),
    ],
  },
  {
    id: 'm4-5', mod: 'm4', title: 'Hyper-Threading', pr: 'High',
    tags: 'hyper-threading smt simultaneous multithreading logical processor physical core esxi core scheduler side channel capacity planning',
    body: `
<div class="def"><b>Hyper-Threading</b> is Intel's implementation of <b>simultaneous multithreading (SMT)</b>. One physical core presents <b>two logical processors</b>, each with its own register state, but both share the execution units and caches of the core.</div>
<div data-w="diag:ht"></div>
<p>When one thread stalls, for example while waiting for memory, the other thread can use the idle units, so the core completes more work in total. The gain depends on the workload and is <b>never double</b>.</p>
<h2>In a hypervisor</h2>
<ul><li>When Hyper-Threading is enabled in the BIOS, the hypervisor sees <b>twice as many logical processors</b>.</li><li><b>ESXi</b> tries to place vCPUs on different physical cores before using both threads of one core, and a per-VM <b>HT sharing mode</b> (Any, None or Internal) controls how the threads may be shared.</li><li><b>Hyper-V</b> can use its <b>core scheduler</b>, which keeps vCPUs of different VMs off the same core.</li><li>Because the two threads share caches, <b>side-channel attacks</b> are possible, so security-conscious sites use the side-channel-aware or core scheduler, or disable Hyper-Threading.</li></ul>
<div class="tip"><b>Capacity planning.</b> Count a host by its <b>physical cores</b>, not by its logical processors. A 16-core host with Hyper-Threading shows 32 logical processors, but it does not have the power of 32 cores.</div>`,
    qa: [
      Q(2, 'What is Hyper-Threading?', 'A technique in which one core presents two logical processors that share its execution units.'),
      Q(5, 'Explain Hyper-Threading and how a hypervisor uses it.', 'Definition (SMT, two logical processors per core sharing execution units and caches); the gain is limited and never double; ESXi spreads vCPUs over different cores first and has an HT sharing mode; Hyper-V core scheduler; side-channel risk; plan capacity by physical cores.'),
    ],
  },
  {
    id: 'm4-6', mod: 'm4', title: 'Memory virtualization', pr: 'Very High',
    tags: 'memory virtualization guest virtual address guest physical address machine address shadow page tables nested paging ept npt rvi tlb large pages numa',
    body: `
<div class="def"><b>Definition.</b> Memory virtualization gives every VM its own <b>private, contiguous physical address space</b> and maps it onto the real memory of the host. VMs are thereby isolated, and the hypervisor can share, reclaim or move memory without the guest being aware of it.</div>
<h2>Three kinds of address</h2>
<table><tr><th>Address</th><th>Used by</th></tr>
<tr><td><b>GVA</b>, guest virtual address</td><td>Applications in the guest</td></tr>
<tr><td><b>GPA</b>, guest physical address</td><td>What the guest OS regards as RAM</td></tr>
<tr><td><b>MA</b>, machine address</td><td>The actual location in host memory</td></tr></table>
<p>The guest page tables translate <b>GVA to GPA</b>, and the hypervisor maps <b>GPA to MA</b>. Both translations are always required; what differs is how they are combined.</p>
<div data-w="diag:mmu"></div>
<h2>Shadow page tables versus nested paging</h2>
<table><tr><th></th><th>Shadow page tables</th><th>Nested paging (Intel EPT, AMD NPT/RVI)</th></tr>
<tr><td><b>Implemented by</b></td><td>Hypervisor software</td><td>CPU hardware</td></tr>
<tr><td><b>Translation</b></td><td>Hypervisor keeps one merged GVA-to-MA table that the CPU uses</td><td>CPU walks the guest table and the nested table; the final result is cached in the TLB</td></tr>
<tr><td><b>Guest page-table updates</b></td><td>Must be trapped to keep the shadow table correct</td><td>No trapping needed</td></tr>
<tr><td><b>Cost</b></td><td>Extra memory and frequent exits</td><td>A TLB miss needs more memory accesses; large pages reduce this</td></tr></table>
<p>Modern processors use <b>nested paging</b>. The hypervisor also benefits from <b>large (2 MB) pages</b>, and on multi-socket hosts it tries to keep a VM's vCPUs and memory in the same <b>NUMA node</b>, because local memory is faster than remote memory.</p>`,
    qa: [
      Q(2, 'State the purpose of nested paging.', 'The CPU walks both the guest and nested page tables in hardware, so shadow page tables are not required.'),
      Q(5, 'Compare shadow page tables and nested paging.', 'Both methods combine the guest’s GVA-to-GPA translation with the hypervisor’s GPA-to-MA mapping. With shadow page tables the hypervisor builds a merged GVA-to-MA table in software and has to trap every change that the guest makes to its page tables, which costs time and memory. With nested paging (EPT/NPT/RVI) the CPU walks the guest page table and the nested table itself, so guest updates are not trapped and the cost is lower, although a TLB miss needs more memory accesses; large pages reduce this effect. Nested paging is therefore used on modern hardware.'),
    ],
  },
  {
    id: 'm4-7', mod: 'm4', title: 'Configuring VM memory options', pr: 'High',
    tags: 'configuring vm memory options configured memory reservation limit shares hot add dynamic memory startup ram minimum maximum buffer weight kvm balloon',
    body: `
<p>The memory options of a VM define how much RAM it sees and how that RAM is <b>guaranteed, limited and prioritised</b>.</p>
<ul>
<li><b>Configured memory</b> – the RAM presented to the guest (Startup RAM in Hyper-V).</li>
<li><b>Reservation</b> – memory that is always backed by physical RAM and is never taken back by ballooning or swapping. "Reserve all guest memory" guarantees the whole amount.</li>
<li><b>Limit</b> – the maximum physical memory the VM may use. Setting it below the configured size forces the hypervisor to reclaim memory even when the host has free RAM, so it is <b>rarely advisable</b>.</li>
<li><b>Shares</b> – relative priority when memory is scarce (VMware: Low = 5, Normal = 10, High = 20 shares per MB of configured memory).</li>
<li><b>Memory hot add</b> – increasing memory while the VM runs, if the guest supports it.</li></ul>
<h2>Hyper-V Dynamic Memory</h2>
<p>The administrator sets a <b>Startup RAM</b>, a <b>Minimum</b> and a <b>Maximum</b> RAM, a <b>memory buffer</b> (default 20%) and a <b>memory weight</b>, and the hypervisor adjusts the memory of the running VM between the limits according to demand.</p>
<p><b>KVM:</b> the maximum memory and the current memory (balloon target) are set separately in the domain definition. <b>VMware:</b> Edit Settings → Virtual Hardware → Memory.</p>
`,
    qa: [
      Q(2, 'Why is a memory limit rarely advisable?', 'A limit below the configured size forces the hypervisor to reclaim memory (ballooning, swapping) even when the host has free RAM.'),
      Q(5, 'Explain the memory options of a virtual machine.', 'Configured memory, reservation (never reclaimed), limit (maximum physical memory), shares (5, 10, 20 per MB) and hot add; Hyper-V Dynamic Memory with startup, minimum, maximum, buffer 20% and weight; KVM maximum and current memory.'),
    ],
  },
  {
    id: 'm4-8', mod: 'm4', title: 'Tuning practices for VM memory', pr: 'High',
    tags: 'tuning practices vm memory balloon driver reservation overcommit large pages numa swap files active consumed ballooned swapped compressed',
    body: `
<ul>
<li><b>Allocate memory according to measured use.</b> Too little causes <b>paging inside the guest</b>; too much wastes host memory and adds overhead.</li>
<li><b>Keep the guest tools installed</b>, because ballooning works only through the balloon driver that they provide.</li>
<li><b>Avoid memory limits</b>, and use <b>reservations</b> for critical VMs such as databases.</li>
<li><b>Do not overcommit memory heavily</b> on production hosts; leave spare capacity for host failure.</li>
<li>Use <b>large pages</b>, keep VMs within a <b>NUMA node</b>, and place <b>swap files on fast storage</b>.</li></ul>
<p>The counters to watch are <b>active, consumed, ballooned, swapped and compressed</b> memory.</p>
<table><tr><th>Symptom</th><th>Meaning</th><th>Remedy</th></tr>
<tr><td>Sustained <b>host</b> swapping</td><td>The host is short of memory: a warning sign</td><td>Remove limits, move VMs to other hosts or add memory</td></tr>
<tr><td>High paging <b>inside the guest</b></td><td>The VM itself is too small</td><td>Give the VM more memory</td></tr></table>`,
    qa: [
      Q(2, 'Why must guest tools be installed for ballooning?', 'Ballooning works only through the balloon driver that the guest tools provide.'),
      Q(5, 'List the practices for tuning VM memory.', 'Allocate from measured use, install guest tools, avoid limits and reserve for critical VMs, avoid heavy overcommitment, use large pages, NUMA locality and swap files on fast storage; watch active, consumed, ballooned, swapped and compressed memory.'),
    ],
  },
  {
    id: 'm4-9', mod: 'm4', title: 'Calculating memory overhead', pr: 'Very High',
    tags: 'calculating memory overhead formula base vcpu page tables frame buffer total host memory overcommit ratio example',
    body: `
<div class="def"><b>Definition.</b> Memory overhead is the <b>additional host memory</b> that the hypervisor needs to run a VM, over and above the memory configured for the guest. It holds the VM process, the emulated virtual hardware, page tables and the video frame buffer.</div>
<p>It depends on the number of vCPUs, the configured memory and the video memory, and it is <b>reserved when the VM powers on</b>, so a VM cannot start if the host cannot supply its memory plus its overhead. VMware publishes overhead values as tables for different vCPU and memory sizes.</p>
<div class="warn"><b>Illustrative model.</b> The formula below is a <b>teaching model</b>, not a standard VMware formula. Its fixed values are assumptions chosen for calculation practice. For real planning the vendor's overhead tables must be used.</div>
<p><code>Overhead = Base + (vCPUs × C) + (Configured memory ÷ 512) + Frame buffer</code></p>
<ul><li><b>Base</b> – fixed cost of the VM process and device emulation; assumed <b>20 MB</b>.</li><li><b>C</b> – cost of each vCPU; assumed <b>5 MB</b> per vCPU.</li><li><b>Configured memory ÷ 512</b> – page-table cost. One 8-byte entry is needed per 4 KB page, and 8 ÷ 4096 = 1/512 of the memory size.</li><li><b>Frame buffer</b> – video memory of the virtual display, taken as 4 MB or 8 MB here.</li><li><b>Total host memory needed</b> = configured memory + overhead (assuming the memory is fully backed).</li></ul>
<div class="ex"><b>Example 1.</b> A VM has 1 vCPU, 4 GB of RAM and a 4 MB frame buffer.
<pre>Configured memory = 4 × 1024 = 4096 MB, so page tables = 4096 ÷ 512 = 8 MB
vCPU cost  = 1 × 5 = 5 MB
Overhead   = 20 + 5 + 8 + 4 = 37 MB
Total needed = 4096 + 37 = 4133 MB</pre></div>
<div class="ex"><b>Example 2.</b> Eight VMs, each with 4 vCPUs, 16 GB of RAM and an 8 MB frame buffer, are to run on a host with 192 GB of RAM. Is memory sufficient?
<pre>Configured memory per VM = 16 × 1024 = 16384 MB, so page tables = 16384 ÷ 512 = 32 MB
vCPU cost = 4 × 5 = 20 MB
Overhead per VM = 20 + 20 + 32 + 8 = 80 MB;  total per VM = 16384 + 80 = 16464 MB
For eight VMs: 8 × 16464 = 131712 MB
Host memory = 192 × 1024 = 196608 MB, so 196608 − 131712 = 64896 MB remain
Memory is sufficient. Overcommit ratio = (8 × 16384) ÷ 196608 = 0.67 : 1, no overcommitment</pre></div>
<div data-w="overhead"></div>`,
    qa: [
      Q(2, 'What is memory overhead?', 'Extra host memory used by the hypervisor to run a VM, in addition to the guest’s configured memory.'),
      Q(2, 'Write the illustrative overhead formula used in these notes.', 'Overhead = Base + (vCPUs × C) + (Memory ÷ 512) + Frame buffer; it is a teaching model, not a VMware formula.'),
      Q(13, 'What is memory overhead? Explain how it is estimated and calculate it for a VM with 2 vCPUs, 12 GB RAM and a 4 MB frame buffer.', '<p>Memory overhead is the extra host memory needed to run a VM in addition to its configured memory; it is reserved at power-on and depends on the vCPUs, memory size and video memory. Using the illustrative teaching formula Overhead = Base + (vCPUs × C) + (Memory ÷ 512) + Frame buffer, with Base = 20 MB and C = 5 MB per vCPU (assumed values, not a VMware formula):</p><pre>Memory = 12 × 1024 = 12288 MB; page tables = 12288 ÷ 512 = 24 MB\nvCPU cost = 2 × 5 = 10 MB\nOverhead = 20 + 10 + 24 + 4 = 58 MB\nTotal host memory needed = 12288 + 58 = 12346 MB</pre><p>Oversized VMs therefore waste host memory, and the reservation plus overhead must fit into the free host memory for the VM to power on. Real planning uses the vendor’s published overhead tables.</p>'),
    ],
  },
  {
    id: 'm4-10', mod: 'm4', title: 'Memory optimizations', pr: 'Very High',
    tags: 'memory optimizations overcommitment transparent page sharing ksm ballooning compression hypervisor swapping smart paging dynamic memory large pages numa reservation',
    body: `
<p>A hypervisor can run VMs whose configured memory together exceeds the physical RAM. This is <b>memory overcommitment</b>. It works because VMs seldom use all their memory at the same time, and because the hypervisor has several techniques to recover memory when the host becomes short of it.</p>
<div data-w="diag:reclaim"></div>
<table><tr><th>Technique</th><th>How it works</th><th>Order of cost</th></tr>
<tr><td><b>Transparent page sharing</b></td><td>Stores identical memory pages only once and shares them between VMs (KSM in KVM). For security reasons, ESXi by default shares pages only within a VM.</td><td>1 (lowest)</td></tr>
<tr><td><b>Ballooning</b></td><td>A driver inside the guest (vmmemctl, Hyper-V Dynamic Memory driver, virtio-balloon). The hypervisor asks the driver to claim memory; the guest OS then frees its least useful pages, which the hypervisor can give to other VMs. The guest decides what to give up, so the impact is small.</td><td>2</td></tr>
<tr><td><b>Memory compression</b></td><td>Compresses pages that would otherwise be swapped and keeps them in memory, much faster than going to disk.</td><td>3</td></tr>
<tr><td><b>Hypervisor swapping</b></td><td>Writes VM memory to a swap file on disk. The guest is unaware of this, so it is the <b>slowest</b> method and is a last resort.</td><td>4 (highest)</td></tr></table>
<p>The figure shows the techniques roughly in the order of increasing cost, and it is a <b>simplified model</b>. The real order, thresholds and overlap differ between hypervisors: ESXi reacts to free-memory states, Hyper-V relies on Dynamic Memory and uses <b>Smart Paging</b> only when a VM restarts, and KVM uses KSM, the balloon driver and host swap.</p>
<p><b>Other optimizations:</b> large pages, NUMA-aware placement, and Dynamic Memory or hot add, which adjust a VM's memory to its demand. <b>Reservations</b> protect important VMs from reclamation.</p>`,
    qa: [
      Q(2, 'What is ballooning?', 'Reclaiming guest memory by a driver in the guest that asks the guest OS to release pages for the hypervisor.'),
      Q(5, 'Explain memory overcommitment and the techniques used to reclaim memory.', 'Overcommitment: configured memory exceeds RAM because VMs seldom peak together. Techniques in order of cost: page sharing, ballooning, compression, hypervisor swapping (last resort). Reservations protect critical VMs.'),
      Q(13, 'Explain memory virtualization and the memory optimization techniques of a hypervisor.', '<p><b>Memory virtualization.</b> Each VM sees a private physical address space (GPA) which the hypervisor maps to machine memory (MA); the guest maps its virtual addresses (GVA) to GPA. Shadow page tables merge the two translations in software, whereas nested paging (EPT/NPT/RVI) lets the hardware walk both tables. As the hypervisor controls the mapping, it can overcommit, share and reclaim memory.</p><p><b>Optimization techniques.</b> Page sharing stores identical pages once. Ballooning makes the guest release unused pages through a driver. Compression keeps pages compressed in memory instead of swapping them. Hypervisor swapping writes VM memory to disk and is the last resort (draw the reclamation figure). Large pages reduce TLB misses, and NUMA-aware placement keeps memory local. Hyper-V adjusts memory at run time by Dynamic Memory.</p><p><b>Configuration.</b> Size, reservation, limit and shares in VMware; startup, minimum, maximum, buffer and weight in Hyper-V. Reservations protect critical VMs; limits should be avoided.</p><p><b>Conclusion.</b> Memory virtualization and reclamation raise VM density, but swapping must remain rare, which requires reservations for key VMs, installed guest tools and monitoring.</p>'),
    ],
  },
];
