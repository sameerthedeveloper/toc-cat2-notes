/** Switches between the sites in this repo: "/" is AI (CSD 3102), "/toc/" Theory of Computation (CSD 3101), "/nsc/" Network Security and Cryptography (CSD 3103), "/dmdw/" Data Mining and Data Warehousing (CSD 3104), "/virt/" Virtualization Technology. */
const DIR = { ai: '', toc: 'toc/', nsc: 'nsc/', dmdw: 'dmdw/', virt: 'virt/' };
export default function CourseSwitch({ current = 'ai' }) {
  const go = (e) => {
    const to = e.target.value;
    if (to === current) return;
    location.href = (current === 'ai' ? './' : '../') + DIR[to];
  };
  return (
    <select className="course" aria-label="Course" title="Switch course" value={current} onChange={go}>
      <option value="ai">AI</option>
      <option value="toc">TOC</option>
      <option value="nsc">NSC</option>
      <option value="dmdw">DMDW</option>
      <option value="virt">VIRT</option>
    </select>
  );
}
