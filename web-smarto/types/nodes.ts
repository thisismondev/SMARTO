export type Nodes = {
  id: number
  kode_node: string
  user_id: number
  name: string
  label: string
  lat: string
  lng: string
  interval_sec: number
  status: string
}

export type KodeNode = {
  id: number
  kode_node: string
  kn_status: string
  status: string
}


export type FormUserNode = {
  kodeNode: string
  userId: number
  label: string
  lat: string
  lng: string
}
