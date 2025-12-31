
'use client';
import { useState } from "react";
import { motion } from "framer-motion";

const GRADES = ["C","C+","B","B+","A","A+","S","S+"];
const PULL_TABLE = [
  { grade: "C", p: 25 },
  { grade: "C+", p: 20 },
  { grade: "B", p: 18 },
  { grade: "B+", p: 15 },
  { grade: "A", p: 11 },
  { grade: "A+", p: 6 },
  { grade: "S", p: 3 },
  { grade: "S+", p: 2 },
];

const LINES = {
  kimchi: ["김치","김치볶음","김치볶음밥"],
  potato: ["감자","감자튀김","치즈감자"],
  milk: ["우유","아이스크림","밀크티"],
  bread: ["식빵","샌드위치","크루아상"],
  gochu: ["고추장","고추장찌개","매운 불고기"]
};
const LINE_KEYS = Object.keys(LINES);

function randomGrade() {
  const r = Math.random() * 100;
  let acc = 0;
  for (const row of PULL_TABLE) {
    acc += row.p;
    if (r <= acc) return row.grade;
  }
  return "C";
}
function randomLineKey() {
  return LINE_KEYS[Math.floor(Math.random() * LINE_KEYS.length)];
}

export default function Page() {
  const [inventory, setInventory] = useState([]);
  const [result, setResult] = useState(null);

  const pull = () => {
    const grade = randomGrade();
    const line = randomLineKey();
    const item = { id: crypto.randomUUID(), line, evo: 0, grade };
    setInventory(v => [...v, item]);
    setResult(item);
  };

  const evolve = (id) => {
    setInventory(prev => prev.map(it => {
      if (it.id !== id) return it;
      const maxEvo = LINES[it.line].length - 1;
      if (it.evo >= maxEvo) return it;
      let nextEvo = it.evo + 1;
      let nextGrade = it.grade;
      if (nextEvo === maxEvo) {
        const idx = GRADES.indexOf(it.grade);
        if (idx < GRADES.length - 1) nextGrade = GRADES[idx + 1];
      }
      return { ...it, evo: nextEvo, grade: nextGrade };
    }));
  };

  const nameOf = (it) => LINES[it.line][it.evo] + " (" + it.grade + ")";

  return (
    <main className="p-6 flex flex-col gap-6 max-w-4xl mx-auto">
      <header className="flex justify-between">
        <h1 className="text-2xl font-bold">음식키우기 — 시험용</h1>
        <button onClick={pull} className="px-4 py-2 rounded-2xl bg-indigo-500 text-white shadow">
          뽑기
        </button>
      </header>

      {result && (
        <motion.div initial={{scale:0.7,opacity:0}} animate={{scale:1,opacity:1}} className="p-4 bg-white shadow rounded-2xl">
          <p>새로 얻은 음식</p>
          <strong>{nameOf(result)}</strong>
        </motion.div>
      )}

      <section className="grid md:grid-cols-2 gap-4">
        {inventory.map(it => (
          <div key={it.id} className="p-4 bg-white shadow rounded-2xl flex flex-col gap-2">
            <p className="font-semibold">{nameOf(it)}</p>
            <div className="flex justify-between text-sm">
              <span>단계: {it.evo+1} / {LINES[it.line].length}</span>
              <button disabled={it.evo===LINES[it.line].length-1}
                onClick={()=>evolve(it.id)}
                className="px-3 py-1 rounded-xl bg-slate-200 disabled:opacity-40">
                진화
              </button>
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
