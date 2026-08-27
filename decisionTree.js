// Interactive N-ary Decision Tree Visualizer for Minimax Search

class DecisionTreeVisualizer {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.currentTree = null;
  }

  render(treeData, bestMoveSan) {
    this.currentTree = treeData;
    if (!this.container || !treeData) return;

    const totalNodes = window.chessEngine.nodesEvaluated || 0;
    const prunedNodes = window.chessEngine.nodesPruned || 0;
    const duration = window.app.currentAnalysis?.durationMs || 0;

    let html = `
      <div class="flex flex-col gap-4">
        <!-- Telemetry Stats -->
        <div class="grid grid-cols-3 gap-2 bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-xs">
          <div class="flex flex-col">
            <span class="text-slate-400">Nodes Explored</span>
            <span class="text-lg font-bold text-sky-400">${totalNodes.toLocaleString()}</span>
          </div>
          <div class="flex flex-col">
            <span class="text-slate-400">Nodes Pruned (α-β)</span>
            <span class="text-lg font-bold text-emerald-400">${prunedNodes.toLocaleString()}</span>
          </div>
          <div class="flex flex-col">
            <span class="text-slate-400">Search Time</span>
            <span class="text-lg font-bold text-indigo-400">${duration} ms</span>
          </div>
        </div>

        <!-- Tree Root & Branches -->
        <div class="overflow-x-auto overflow-y-auto max-h-[380px] p-2 bg-slate-950/70 rounded-xl border border-slate-800">
          <div class="flex flex-col items-center">
            <!-- Root Node -->
            <div class="flex flex-col items-center mb-6">
              <div class="px-4 py-2 bg-gradient-to-r from-sky-600 to-indigo-600 rounded-xl text-white font-bold shadow-lg shadow-sky-500/20 text-xs border border-sky-400">
                Root Position (Score: ${(treeData.eval / 100).toFixed(1)})
              </div>
              <div class="w-0.5 h-6 bg-slate-600"></div>
            </div>

            <!-- Level 1 Branches (Candidate Moves) -->
            <div class="flex flex-wrap justify-center gap-3 w-full">
    `;

    if (treeData.children && treeData.children.length > 0) {
      treeData.children.forEach((child) => {
        const isBest = child.move === bestMoveSan;
        const evalPawns = child.eval !== null ? (child.eval / 100).toFixed(1) : '?';
        const isPruned = child.pruned;

        html += `
          <div class="flex flex-col items-center bg-slate-900/90 rounded-xl p-3 border ${
            isBest 
              ? 'border-emerald-500 shadow-lg shadow-emerald-500/20 ring-1 ring-emerald-400' 
              : isPruned 
                ? 'border-red-500/40 opacity-70' 
                : 'border-slate-800'
          } min-w-[130px] transition-all hover:scale-105">
            <div class="flex items-center justify-between w-full mb-1 text-xs">
              <span class="font-bold ${isBest ? 'text-emerald-400' : 'text-slate-200'}">${child.move}</span>
              ${isBest ? '<span class="px-1.5 py-0.5 bg-emerald-500/20 text-emerald-300 rounded text-[9px] font-semibold">BEST</span>' : ''}
              ${isPruned ? '<span class="px-1.5 py-0.5 bg-red-500/20 text-red-300 rounded text-[9px] font-semibold">PRUNED</span>' : ''}
            </div>

            <div class="text-[11px] text-slate-400 mb-2">
              Eval: <span class="${child.eval >= 0 ? 'text-sky-400' : 'text-amber-400'} font-semibold">${evalPawns}</span>
            </div>

            <!-- Sub-children preview -->
            ${child.children && child.children.length > 0 ? `
              <div class="w-full pt-2 border-t border-slate-800 text-[10px] text-slate-400 flex flex-col gap-1">
                <span class="text-[9px] uppercase tracking-wider text-slate-400 font-semibold">Replies (${child.children.length}):</span>
                <div class="flex flex-wrap gap-1">
                  ${child.children.slice(0, 3).map(c => `
                    <span class="px-1 py-0.5 bg-slate-800 rounded text-slate-300 text-[9px]">${c.move} (${c.eval !== null ? (c.eval/100).toFixed(1) : 'cutoff'})</span>
                  `).join('')}
                  ${child.children.length > 3 ? `<span class="text-slate-400 text-[9px]">+${child.children.length - 3}</span>` : ''}
                </div>
              </div>
            ` : ''}
          </div>
        `;
      });
    } else {
      html += `<div class="text-slate-400 text-xs py-4">No tree data generated.</div>`;
    }

    html += `
            </div>
          </div>
        </div>
      </div>
    `;

    this.container.innerHTML = html;
  }
}
