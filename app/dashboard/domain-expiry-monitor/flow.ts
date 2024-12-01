export const domainExpiryMonitorFlow = ({
  id,
  domain,
}: {
  id: string;
  domain: string;
}) => {
  return `id: ${id}
namespace: domain-monitoring
tasks:
  - id: check_domain
    type: io.kestra.plugin.scripts.python.Script
    containerImage: python:3.9
    beforeCommands:
      - pip install Kestra python-whois
    script: |
      import whois
      import datetime
      import json
      from datetime import datetime
      from kestra import Kestra

      def check_domain_expiry(domain_name):
          try:
              domain = whois.whois(domain_name)
              
              if isinstance(domain.expiration_date, list):
                  expiry_date = domain.expiration_date[0]
              else:
                  expiry_date = domain.expiration_date

              days_remaining = (expiry_date - datetime.now()).days
              
              result = {
                  "domain": domain_name,
                  "expiry_date": expiry_date.isoformat(),
                  "days_remaining": days_remaining,
                  "registrar": domain.registrar,
                  "status": "active" if days_remaining > 0 else "expired"
              }
              return result
          except Exception as e:
              return {
                  "domain": domain_name,
                  "error": str(e),
                  "status": "error"
              }

      result = check_domain_expiry("${domain}")
      Kestra.outputs({
        "result": result
      })

  - id: store_domain_status
    type: io.kestra.plugin.core.kv.Set
    key: "${id}-status"
    value: "{{ outputs.check_domain.vars.result }}"

  # - id: alert_if_expiring
    # type: io.kestra.core.tasks.flows.Condition
    # condition: "{{ outputs.check_domain.vars.days_remaining < 30 }}"
    # tasks:
    #   - id: send_alert
    #     type: io.kestra.plugin.notifications.mail.Send
    #     from: alerts@company.com
    #     to: admin@company.com
    #     subject: "Domain Expiry Alert: {{ outputs.check_domain.vars.domain }}"
    #     content: |
    #       Domain {{ outputs.check_domain.vars.domain }} will expire in {{ outputs.check_domain.vars.days_remaining }} days.
    #       Expiry Date: {{ outputs.check_domain.vars.expiry_date }}
    #       Registrar: {{ outputs.check_domain.vars.registrar }}
          # Please renew soon.

triggers:
  - id: weekly_check
    type: io.kestra.plugin.core.trigger.Schedule
    cron: "0 0 * * 0"  # Run weekly on Sunday at midnight`;
};
