/* Capacity calculators and diagrams for the virtualization notes. */
export const fmt = (x, d = 2) => (Number.isFinite(x) ? String(+x.toFixed(d)) : String(x));

/* Memory overhead: the illustrative teaching model from the study material, not a vendor formula.
   Overhead = Base + vCPUs x C + RAM/512 + frame buffer, all in MB. */
export function overhead({ vcpus, ramGB, fb, base = 20, c = 5 }) {
  const ram = ramGB * 1024, pt = ram / 512, vcpu = vcpus * c;
  const oh = base + vcpu + pt + fb;
  return { ram, pt, vcpu, oh, total: ram + oh };
}
export function hostFit({ n, vcpus, ramGB, fb, hostGB }) {
  const o = overhead({ vcpus, ramGB, fb });
  const need = n * o.total, host = hostGB * 1024;
  return { o, need, host, left: host - need, ratio: (n * o.ram) / host, ok: host >= need };
}

/* CPU shares under contention. VMware: Low 500, Normal 1000, High 2000 shares per vCPU. */
export const PER_VCPU = { Low: 500, Normal: 1000, High: 2000 };
export function shares(vms) {
  const rows = vms.map((v) => ({ ...v, s: v.vcpus * PER_VCPU[v.level] }));
  const tot = rows.reduce((a, r) => a + r.s, 0);
  return { rows: rows.map((r) => ({ ...r, pct: tot ? (100 * r.s) / tot : 0 })), tot };
}

/* vCPU to core ratio of a host. */
export function cpuRatio({ sockets, cores, ht, vms, vcpus }) {
  const phys = sockets * cores, logical = ht ? phys * 2 : phys, v = vms * vcpus;
  return { phys, logical, v, perCore: v / phys, perLogical: v / logical };
}

/* Thin provisioning: allocated against real use against datastore size. */
export function thin({ n, size, used, store }) {
  const alloc = n * size, real = n * used;
  return { alloc, real, over: alloc / store, fill: (100 * real) / store, saved: alloc - real };
}

/* ---- Diagram helper (boxes and labelled arrows) ---- */
export function netSVG(nodes, edges, W, H, opt = {}) {
  const nw = opt.nw || 118, nh = opt.nh || 34; const N = {}; nodes.forEach((n) => (N[n.id] = n));
  const clip = (a, b) => { const dx = b.x - a.x, dy = b.y - a.y; const aw = (a.w || nw) / 2, ah = (a.h || nh) / 2; const t = Math.min(dx ? aw / Math.abs(dx) : 1e9, dy ? ah / Math.abs(dy) : 1e9); return [a.x + dx * t, a.y + dy * t]; };
  let s = `<svg class="net" viewBox="0 0 ${W} ${H}" width="${W}" role="img" aria-label="${opt.label || 'diagram'}"><defs><marker id="ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="currentColor"/></marker></defs>`;
  edges.forEach(([f, t, l, d]) => {
    const a = N[f], b = N[t]; const [x1, y1] = clip(a, b), [x2, y2] = clip(b, a);
    s += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" ${d ? 'stroke-dasharray="5 4"' : ''} marker-end="url(#ar)"/>`;
    if (l) s += `<text class="el" x="${(x1 + x2) / 2}" y="${(y1 + y2) / 2 - 5}" text-anchor="middle">${l}</text>`;
  });
  nodes.forEach((n) => { const w = n.w || nw, h = n.h || nh; s += `<g class="nd ${n.c || ''}"><rect x="${n.x - w / 2}" y="${n.y - h / 2}" width="${w}" height="${h}" rx="${n.r ?? 4}"/><text x="${n.x}" y="${n.y + 4}" text-anchor="middle">${n.t}</text></g>`; });
  return s + '</svg>';
}
const hop = (id, x, y, t, c, w, h) => ({ id, x, y, t, c, w, h });
export const DIAG = {
  cpu: () => netSVG([hop('v1', 70, 30, 'VM 1: vCPU0 vCPU1', '', 130), hop('v2', 70, 90, 'VM 2: vCPU0', '', 130), hop('v3', 80, 150, 'VM 3: vCPU0 .. vCPU3', '', 160), hop('s', 290, 90, 'Hypervisor scheduler', 'hi', 160), hop('c1', 520, 30, 'Core 1', 'prop', 80), hop('c2', 520, 90, 'Core 2', 'prop', 80), hop('c3', 520, 150, 'Core 3 .. Core n', 'prop', 120)],
    [['v1', 's'], ['v2', 's'], ['v3', 's'], ['s', 'c1', 'time slices'], ['s', 'c2'], ['s', 'c3']], 620, 180, { label: 'vCPUs scheduled on physical cores' }),
  ht: () => netSVG([hop('a', 110, 30, 'Without HT: 1 thread', '', 160), hop('ac', 110, 100, 'Core: units + caches', 'prop', 170), hop('b1', 400, 30, 'Thread 1', '', 90), hop('b2', 520, 30, 'Thread 2', '', 90), hop('bc', 460, 100, 'Core: shared units + caches', 'prop', 220)],
    [['a', 'ac'], ['b1', 'bc'], ['b2', 'bc']], 620, 135, { label: 'A core with and without Hyper-Threading' }),
  mmu: () => netSVG([hop('g', 70, 60, 'GVA', '', 70), hop('p', 290, 60, 'GPA', 'hi', 70), hop('m', 510, 60, 'MA', 'prop', 70), hop('s', 290, 140, 'Shadow table: GVA to MA (software)', 'bad', 300)],
    [['g', 'p', 'guest page table'], ['p', 'm', 'hypervisor maps'], ['g', 's', '', 1], ['s', 'm', '', 1]], 620, 175, { label: 'Address translation and MMU virtualization' }),
  reclaim: () => netSVG([hop('a', 70, 50, 'Page sharing', 'prop', 110), hop('b', 215, 50, 'Ballooning', 'prop', 110), hop('c', 360, 50, 'Compression', 'hi', 110), hop('d', 515, 50, 'Hypervisor swap', 'bad', 130)],
    [['a', 'b'], ['b', 'c'], ['c', 'd', 'last resort']], 620, 100, { label: 'Memory reclamation techniques in increasing cost' }),
  stor: () => netSVG([hop('a', 330, 25, 'Guest OS sees a SCSI, SATA or NVMe disk', '', 300), hop('b', 330, 80, 'Virtual disk file: VMDK, VHD/VHDX, qcow2', 'prop', 320), hop('c', 330, 135, 'Datastore: VMFS, NFS, CSV, SMB share', 'hi', 320), hop('d', 330, 190, 'Physical: local disks, SAN LUN, NAS share, vSAN pool', 'prop', 380)],
    [['a', 'b'], ['b', 'c'], ['c', 'd']], 660, 220, { label: 'Layers of storage virtualization' }),
  vswitch: () => netSVG([hop('v1', 65, 30, 'VM 1 (vNIC)', '', 100), hop('v2', 65, 85, 'VM 2 (vNIC)', '', 100), hop('h', 65, 140, 'Host services', '', 100), hop('s', 290, 85, 'Virtual switch: port groups, VLAN IDs', 'hi', 260, 60), hop('u', 520, 85, 'Uplinks (teamed NICs)', 'prop', 160), hop('p', 650, 85, 'Physical net', '', 90)],
    [['v1', 's'], ['v2', 's'], ['h', 's'], ['s', 'u'], ['u', 'p']], 710, 175, { label: 'A virtual switch connecting VMs, host services and the physical network' }),
  secnet: () => netSVG([hop('i', 55, 55, 'Internet', '', 80), hop('f', 185, 55, 'Perimeter firewall', 'bad', 130), hop('w', 345, 20, 'Web VLAN', 'hi', 100), hop('a', 345, 80, 'Application VLAN', 'hi', 140), hop('d', 345, 140, 'Database VLAN', 'hi', 130), hop('x', 590, 80, 'Management, migration, storage', 'prop', 220, 54)],
    [['i', 'f'], ['f', 'w'], ['w', 'a', 'distributed firewall'], ['a', 'd'], ['a', 'x', 'kept apart', 1]], 720, 170, { label: 'A secure virtual network design' }),
};
