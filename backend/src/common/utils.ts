export function truncateString(str:string, index:number) {
	// If the length of str is less than or equal to num
	// just return str--don't truncate it.
	if (str.length <= index) {
	  return str
	}
	// Return str truncated with '...' concatenated to the end of str.
	return str.slice(0, index) + '..'
  }