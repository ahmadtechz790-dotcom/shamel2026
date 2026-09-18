const statsKey = "shamel-results-stats";
const formatter = new Intl.NumberFormat("en-US");
const supabaseClient = window.supabase?.createClient(window.supabaseConfig.url, window.supabaseConfig.anonKey);
const stats = JSON.parse(localStorage.getItem(statsKey) || '{"visits":0,"searches":[],"browsers":{}}');
const searches = stats.searches || [];
const visitors = stats.visitors || [];
const found = searches.filter((item) => item.found).length;
const counts = searches.reduce((all, item) => { all[item.number] = (all[item.number] || 0) + 1; return all; }, {});

document.querySelector("#visits").textContent = formatter.format(stats.visits || 0);
document.querySelector("#searches").textContent = formatter.format(searches.length);
document.querySelector("#found").textContent = formatter.format(found);
document.querySelector("#unique").textContent = formatter.format(Object.keys(counts).length);

const numbers = Object.entries(counts).sort((a, b) => b[1] - a[1]);
document.querySelector("#numbers").innerHTML = numbers.length ? numbers.map(([number, count]) => `<div class="number-row"><strong>${number}</strong><span class="count">${formatter.format(count)}</span></div>`).join("") : '<div class="empty">لا توجد عمليات بحث بعد</div>';
const browsers = Object.entries(stats.browsers || {}).sort((a, b) => b[1] - a[1]);
document.querySelector("#browsers").innerHTML = browsers.length ? browsers.map(([browser, count]) => `<div class="browser-row"><span>${browser}</span><strong>${formatter.format(count)}</strong></div>`).join("") : '<div class="empty">لا توجد زيارات بعد</div>';
document.querySelector("#recent").innerHTML = searches.length ? searches.slice(0, 12).map((item) => `<div class="recent-row"><strong>${item.number}</strong><time>${new Date(item.time).toLocaleString("ar", { dateStyle: "short", timeStyle: "short" })}</time></div>`).join("") : '<div class="empty">لا توجد عمليات بحث بعد</div>';
document.querySelector("#visitors").innerHTML = visitors.length ? visitors.slice(0, 20).map((item) => `<div class="visitor-row"><div><strong>${item.device}</strong><span>${item.operatingSystem}</span></div><div><strong>${item.browser}</strong><span>${item.language}</span></div><div><strong>${item.screen}</strong><span>${item.timezone}</span></div><div><strong>${new Date(item.time).toLocaleString("ar", { dateStyle: "short", timeStyle: "short" })}</strong><small>${item.referrer}</small></div></div>`).join("") : '<div class="empty">لا توجد زيارات بعد</div>';
document.querySelector("#clear-stats").addEventListener("click", () => { if (confirm("هل تريد مسح سجل الإحصائيات؟")) { localStorage.removeItem(statsKey); location.reload(); } });

async function loadSupabaseStats() {
	if (!supabaseClient) return;
	const { data, error } = await supabaseClient.from("visitor_stats").select("student_number, found, browser, device, ip, country, visited_at").order("visited_at", { ascending: false }).limit(1000);
	if (error) { console.error("Supabase read failed:", error.message); return; }
	const visits = data.filter((row) => !row.student_number);
	const searches = data.filter((row) => row.student_number);
	const counts = searches.reduce((all, row) => { all[row.student_number] = (all[row.student_number] || 0) + 1; return all; }, {});
	const browsers = visits.reduce((all, row) => { all[row.browser] = (all[row.browser] || 0) + 1; return all; }, {});
	document.querySelector("#visits").textContent = formatter.format(visits.length);
	document.querySelector("#searches").textContent = formatter.format(searches.length);
	document.querySelector("#found").textContent = formatter.format(searches.filter((row) => row.found).length);
	document.querySelector("#unique").textContent = formatter.format(Object.keys(counts).length);
	document.querySelector("#numbers").innerHTML = Object.entries(counts).sort((a, b) => b[1] - a[1]).map(([number, count]) => `<div class="number-row"><strong>${number}</strong><span class="count">${formatter.format(count)}</span></div>`).join("") || '<div class="empty">لا توجد عمليات بحث بعد</div>';
	document.querySelector("#browsers").innerHTML = Object.entries(browsers).map(([browser, count]) => `<div class="browser-row"><span>${browser}</span><strong>${formatter.format(count)}</strong></div>`).join("") || '<div class="empty">لا توجد زيارات بعد</div>';
	document.querySelector("#recent").innerHTML = searches.slice(0, 12).map((row) => `<div class="recent-row"><strong>${row.student_number}</strong><time>${new Date(row.visited_at).toLocaleString("ar", { dateStyle: "short", timeStyle: "short" })}</time></div>`).join("") || '<div class="empty">لا توجد عمليات بحث بعد</div>';
	document.querySelector("#visitors").innerHTML = visits.slice(0, 20).map((row) => `<div class="visitor-row"><div><strong>${row.device || "غير معروف"}</strong></div><div><strong>${row.browser || "غير معروف"}</strong></div><div><strong>${row.ip || "غير متوفر"}</strong><span>${row.country || "غير متوفر"}</span></div><div><strong>${new Date(row.visited_at).toLocaleString("ar", { dateStyle: "short", timeStyle: "short" })}</strong></div></div>`).join("") || '<div class="empty">لا توجد زيارات بعد</div>';
}

loadSupabaseStats();