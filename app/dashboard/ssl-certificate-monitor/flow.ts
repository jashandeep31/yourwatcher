export const sslMonitoringTaskFlow = ({
  uniqueId,
  url,
}: {
  uniqueId: string;
  url: string;
}): string => {
  return `id: ${uniqueId}
namespace: monitoring
tasks:
  - id: check_ssl
    type: io.kestra.plugin.scripts.python.Script
    containerImage: python:3.9
    beforeCommands:
      - pip install kestra
    script: |
      from kestra import Kestra
      import ssl
      import socket
      import datetime
      import json
      
      def check_ssl_expiry(hostname):
          context = ssl.create_default_context()
          with context.wrap_socket(socket.socket(socket.AF_INET), server_hostname=hostname) as ssock:
              ssock.connect((hostname, 443))
              cert = ssock.getpeercert()
              expiry_date = datetime.datetime.strptime(cert['notAfter'], '%b %d %H:%M:%S %Y %Z')
              days_remaining = (expiry_date - datetime.datetime.now()).days
              return expiry_date, days_remaining
              
      expiry_date, days_remaining = check_ssl_expiry("${url}")
      
      Kestra.outputs({
          'days': days_remaining,
          'expiry': expiry_date.isoformat()
      })

  - id: store_ssl_status
    type: io.kestra.plugin.core.kv.Set
    key: "${uniqueId}-status"
    value:  "{{ outputs.check_ssl.vars.days }}"
    kvType: NUMBER
    
triggers:
  - id: daily_check
    type: io.kestra.plugin.core.trigger.Schedule
    cron: "0 0 * * *"
    
errors:
  - id: store_ssl_status_error
    type: io.kestra.plugin.core.kv.Set
    key: "${uniqueId}-status"
    value:  "-1"
    kvType: NUMBER
    `;
};
