const mem = new Proxy({}, {
	// Разрешаем запись свойств (сохраняем в localStorage)
	set(target, key, value) {
		try {
			localStorage.setItem(key, JSON.stringify(value));
			return true;
		} catch (e) {
			console.error('[Storage] Не удалось сохранить данные:', e);
			return false;
		}
	},
	
	// Разрешаем чтение свойств (берём из localStorage)
	get(target, key) {
		const raw = localStorage.getItem(key);
		if(raw === null) return undefined;
		try {
		  return JSON.parse(raw);
		} catch (e) {
		  return raw; // если не JSON — возвращаем как строку
		}
	},
	
	// Разрешаем удаление свойств через delete mem.key
	deleteProperty(target, key) {
		if(key == "__all") {
			localStorage.clear();
			return true;
		}
		
		localStorage.removeItem(key);
		return true; // важно: возвращаем true, чтобы операция прошла
	}
});

// Защищаем саму переменную mem от перезаписи и удаления
Object.defineProperty(window, 'mem', {
	value: mem,
	writable: false,      // нельзя перезаписать (mem = ... не сработает)
	configurable: false,  // нельзя удалить (delete window.mem не сработает)
	enumerable: true      // видно в перечислениях (например, в console.log(window))
});
