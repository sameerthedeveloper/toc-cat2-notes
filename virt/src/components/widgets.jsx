import { useState } from 'react';
import { DIAG, PER_VCPU, cpuRatio, fmt, hostFit, overhead, shares, thin } from '../engines.js';

const Html = ({ html }) => <div style={{ display: 'contents' }} dangerouslySetInnerHTML={{ __html: html }} />;
const Verdict = ({ ok, children }) => <span className={'verdict ' + (ok ? 'ok' : 'bad')}>{children}</span>;
export const Diag = ({ name }) => <div className="wg"><Html html={DIAG[name]()} /></div>;

const num = (s, min = 0) => { const v = Number(String(s).trim()); if (String(s).trim() === '' || !Number.isFinite(v)) throw new Error('"' + s + '" is not a number'); if (v < min) throw new Error('values cannot be below ' + min); return v; };
const run = (fn) => { try { return { r: fn() }; } catch (e) { return { err: e.message }; } };
const Num = ({ label, value, onChange, w = 70 }) => (
  <label>{label}<input type="text" inputMode="decimal" value={value} style={{ width: w, minWidth: w, flex: 'none' }} onChange={(e) => onChange(e.target.value)} /></label>
);

/* ---------- memory overhead (teaching model) ---------- */
export function Overhead() {
  const [f, setF] = useState({ n: '8', vcpus: '4', ram: '16', fb: '8', host: '192' });
  const set = (k) => (v) => setF({ ...f, [k]: v });
  const o = run(() => hostFit({ n: num(f.n, 1), vcpus: num(f.vcpus, 1), ramGB: num(f.ram, 0.001), fb: num(f.fb), hostGB: num(f.host, 0.001) }));
  const r = o.r;
  return (
    <div className="wg">
      <h4>Memory overhead calculator (teaching model)</h4>
      <p className="mini">Overhead = 20 + vCPUs × 5 + RAM ÷ 512 + frame buffer, all in MB. Not a VMware formula.</p>
      <div className="row">
        <Num label="VMs" value={f.n} onChange={set('n')} /><Num label="vCPUs per VM" value={f.vcpus} onChange={set('vcpus')} />
        <Num label="RAM per VM (GB)" value={f.ram} onChange={set('ram')} /><Num label="Frame buffer (MB)" value={f.fb} onChange={set('fb')} />
        <Num label="Host RAM (GB)" value={f.host} onChange={set('host')} />
      </div>
      <div className="row"><span className="mini">Try:</span>
        <button className="btn sm" type="button" onClick={() => setF({ n: '1', vcpus: '1', ram: '4', fb: '4', host: '16' })}>Example 1 (1 vCPU, 4 GB)</button>
        <button className="btn sm" type="button" onClick={() => setF({ n: '8', vcpus: '4', ram: '16', fb: '8', host: '192' })}>Example 2 (8 VMs on 192 GB)</button>
        <button className="btn sm" type="button" onClick={() => setF({ n: '1', vcpus: '2', ram: '12', fb: '4', host: '16' })}>Exam: 2 vCPUs, 12 GB</button>
      </div>
      {o.err && <Verdict>{o.err}</Verdict>}
      {r && (
        <>
          <pre>{`Configured memory per VM = ${f.ram} × 1024 = ${fmt(r.o.ram, 0)} MB
Page tables  = ${fmt(r.o.ram, 0)} ÷ 512 = ${fmt(r.o.pt)} MB
vCPU cost    = ${f.vcpus} × 5 = ${fmt(r.o.vcpu)} MB
Overhead per VM = 20 + ${fmt(r.o.vcpu)} + ${fmt(r.o.pt)} + ${f.fb} = ${fmt(r.o.oh)} MB
Total per VM = ${fmt(r.o.ram, 0)} + ${fmt(r.o.oh)} = ${fmt(r.o.total)} MB
For ${f.n} VM${Number(f.n) === 1 ? '' : 's'}: ${f.n} × ${fmt(r.o.total)} = ${fmt(r.need)} MB
Host memory = ${f.host} × 1024 = ${fmt(r.host, 0)} MB
Left over   = ${fmt(r.left)} MB
Overcommit ratio = (${f.n} × ${fmt(r.o.ram, 0)}) ÷ ${fmt(r.host, 0)} = ${fmt(r.ratio)} : 1`}</pre>
          <Verdict ok={r.ok}>{r.ok ? `Memory is sufficient${r.ratio > 1 ? ' (memory is overcommitted)' : ' (no overcommitment)'}.` : 'Not enough host memory: the VMs cannot all power on.'}</Verdict>
        </>
      )}
    </div>
  );
}

/* ---------- CPU shares under contention ---------- */
export function Shares() {
  const [vms, setVms] = useState([{ name: 'VM-A', vcpus: '2', level: 'Normal' }, { name: 'VM-B', vcpus: '1', level: 'Normal' }]);
  const upd = (i, k, v) => setVms(vms.map((x, j) => (j === i ? { ...x, [k]: v } : x)));
  const o = run(() => shares(vms.map((v) => ({ ...v, vcpus: num(v.vcpus, 1) }))));
  const r = o.r;
  return (
    <div className="wg">
      <h4>CPU shares under contention</h4>
      <p className="mini">VMware gives each vCPU 500 (Low), 1000 (Normal) or 2000 (High) shares. Shares only matter when the CPU is contended.</p>
      {vms.map((v, i) => (
        <div className="row" key={i}>
          <label>VM<input type="text" value={v.name} style={{ width: 80, minWidth: 80, flex: 'none' }} onChange={(e) => upd(i, 'name', e.target.value)} /></label>
          <Num label="vCPUs" value={v.vcpus} onChange={(x) => upd(i, 'vcpus', x)} w={55} />
          <label>Shares level<select value={v.level} onChange={(e) => upd(i, 'level', e.target.value)}>{Object.keys(PER_VCPU).map((l) => <option key={l}>{l}</option>)}</select></label>
        </div>
      ))}
      <div className="row">
        <button className="btn sm" type="button" onClick={() => setVms([...vms, { name: 'VM-' + String.fromCharCode(65 + vms.length), vcpus: '1', level: 'Normal' }])}>Add a VM</button>
        {vms.length > 2 && <button className="btn sm" type="button" onClick={() => setVms(vms.slice(0, -1))}>Remove last</button>}
      </div>
      {o.err && <Verdict>{o.err}</Verdict>}
      {r && (
        <pre>{r.rows.map((x) => `${x.name}: ${x.vcpus} vCPU × ${PER_VCPU[x.level]} (${x.level}) = ${x.s} shares  →  ${fmt(x.pct, 1)}% of CPU under contention`).join('\n')}{`\nTotal shares = ${r.tot}`}</pre>
      )}
    </div>
  );
}

/* ---------- vCPU to core ratio ---------- */
export function Cpu() {
  const [f, setF] = useState({ sockets: '2', cores: '8', vms: '10', vcpus: '4' });
  const [ht, setHt] = useState(false);
  const set = (k) => (v) => setF({ ...f, [k]: v });
  const o = run(() => cpuRatio({ sockets: num(f.sockets, 1), cores: num(f.cores, 1), ht, vms: num(f.vms, 1), vcpus: num(f.vcpus, 1) }));
  const r = o.r;
  return (
    <div className="wg">
      <h4>vCPU-to-core ratio</h4>
      <div className="row">
        <Num label="Sockets" value={f.sockets} onChange={set('sockets')} w={55} /><Num label="Cores per socket" value={f.cores} onChange={set('cores')} w={55} />
        <Num label="VMs" value={f.vms} onChange={set('vms')} w={55} /><Num label="vCPUs per VM" value={f.vcpus} onChange={set('vcpus')} w={55} />
        <label><input type="checkbox" checked={ht} onChange={(e) => setHt(e.target.checked)} /> Hyper-Threading on</label>
      </div>
      {o.err && <Verdict>{o.err}</Verdict>}
      {r && (
        <>
          <pre>{`Physical cores   = ${f.sockets} × ${f.cores} = ${r.phys}
Logical processors = ${r.logical}${ht ? ' (twice the cores, but not twice the power)' : ''}
Total vCPUs      = ${f.vms} × ${f.vcpus} = ${r.v}
vCPUs per physical core = ${fmt(r.perCore)} : 1
vCPUs per logical processor = ${fmt(r.perLogical)} : 1`}</pre>
          <Verdict ok={r.perCore <= 1}>{r.perCore <= 1 ? 'No CPU overcommitment.' : `CPU overcommitted ${fmt(r.perCore)} : 1. This is acceptable only if the VMs are lightly loaded and CPU Ready stays low. Plan on physical cores.`}</Verdict>
        </>
      )}
    </div>
  );
}

/* ---------- thin provisioning ---------- */
export function Thin() {
  const [f, setF] = useState({ n: '10', size: '100', used: '30', store: '500' });
  const set = (k) => (v) => setF({ ...f, [k]: v });
  const o = run(() => thin({ n: num(f.n, 1), size: num(f.size, 0.001), used: num(f.used), store: num(f.store, 0.001) }));
  const r = o.r;
  return (
    <div className="wg">
      <h4>Thin provisioning and over-allocation</h4>
      <div className="row">
        <Num label="Disks" value={f.n} onChange={set('n')} w={55} /><Num label="Size each (GB)" value={f.size} onChange={set('size')} w={65} />
        <Num label="Data in each (GB)" value={f.used} onChange={set('used')} w={65} /><Num label="Datastore (GB)" value={f.store} onChange={set('store')} w={70} />
      </div>
      {o.err && <Verdict>{o.err}</Verdict>}
      {r && (
        <>
          <pre>{`Allocated = ${f.n} × ${f.size} = ${fmt(r.alloc, 0)} GB
Really used = ${f.n} × ${f.used} = ${fmt(r.real, 0)} GB
Space saved by thin provisioning = ${fmt(r.saved, 0)} GB
Datastore ${f.store} GB: ${fmt(r.fill, 0)}% full now, over-allocated ${fmt(r.over)} : 1`}</pre>
          <Verdict ok={r.real <= Number(f.store) && r.over <= 1}>{r.real > Number(f.store) ? 'The datastore is already full: VMs will pause.' : r.over > 1 ? 'Over-allocated: it works only while the data stays below the datastore size, so monitor free space.' : 'Not over-allocated.'}</Verdict>
        </>
      )}
    </div>
  );
}

/* ---------- storage latency ---------- */
export function Latency() {
  const [f, setF] = useState({ davg: '12', kavg: '1.5' });
  const o = run(() => ({ d: num(f.davg), k: num(f.kavg) }));
  const g = o.r ? o.r.d + o.r.k : 0;
  return (
    <div className="wg">
      <h4>Guest latency: GAVG = DAVG + KAVG</h4>
      <div className="row"><Num label="DAVG, device (ms)" value={f.davg} onChange={(v) => setF({ ...f, davg: v })} w={65} /><Num label="KAVG, kernel (ms)" value={f.kavg} onChange={(v) => setF({ ...f, kavg: v })} w={65} /></div>
      {o.err && <Verdict>{o.err}</Verdict>}
      {o.r && <><pre>{`GAVG = ${f.davg} + ${f.kavg} = ${fmt(g)} ms`}</pre><Verdict ok={g < 20}>{g < 20 ? 'Below the 20 to 30 ms warning range.' : g <= 30 ? 'In the 20 to 30 ms range: investigate. Too many busy VMs may share one LUN.' : 'Above 30 ms: a common warning sign. Move VMs to another datastore, add faster media or enable I/O control.'}</Verdict></>}
    </div>
  );
}
