export const menuKeyToCommands = {
  pods: { path: '~/dev/vod/rms/scripts', execution: `pods`, args: '' },
  info: { path: '~/dev/vod/rms/scripts', execution: `info`, args: '' },
  svc: { path: '~/dev/vod/rms/scripts', execution: `svc`, args: '' },
  rc: { path: '~/dev/vod/rms/scripts', execution: `rc`, args: '' },
  deployments: { path: '~/dev/vod/rms/scripts', execution: `deployments`, args: '' },
  apiServer: { path: '~/dev/vod/rms/scripts', execution: `api-server`, args: '' },
  pv: { path: '~/dev/vod/rms/scripts', execution: `pv`, args: '' },
  pvc: { path: '~/dev/vod/rms/scripts', execution: `pvc`, args: '' },
  events:{ path: '~/dev/vod/rms/scripts', execution: `event-default`, args: '' },
  versions:{ path: '~/dev/vod/rms/scripts', execution: `versions`, args: '' },
  nodesChechk:{ path: '~/dev/vod/rms/scripts', execution: `nodes-check`, args: '' },
  redisMasterIp:{ path: '~/dev/vod/rms/scripts', execution: `redis-master-ip`, args: '' },
  redisMasterPod:{ path: '~/dev/vod/rms/scripts', execution: `redis-master-pod`, args: '' },
  vodDown:{ path: '~/dev/vod/rms/scripts', execution: `vod-down`, args: '' },
  vodUp:{ path: '~/dev/vod/rms/scripts', execution: `vod-up`, args: '' },
  
}

export const commandFormater = (scriptsPath,command) => {
  if (!command) {
    return
  }
  let path = scriptsPath ? `cd ${scriptsPath}` : '';
  let execution = command.execution ? `./${command.execution}` : '';
  let args = command.args ? `${command.args}` : '';
  return `${path};${execution} ${args}`;
}