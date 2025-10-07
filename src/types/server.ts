// 定义服务器类型
export interface Server {
  name: string;
  alias: string;
  type: string;
  location: string;
  online: boolean;
  online4: boolean;
  online6: boolean;
  uptime: string;
  load_1: number;
  load_5: number;
  load_15: number;
  network_rx: number;
  network_tx: number;
  network_in: number;
  network_out: number;
  cpu: number;
  memory_total: number;
  memory_used: number;
  swap_total: number;
  swap_used: number;
  hdd_total: number;
  hdd_used: number;
  weight: number;
}


