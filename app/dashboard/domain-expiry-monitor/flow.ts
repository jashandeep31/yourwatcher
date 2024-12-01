export const domainExpiryMonitorFlow = ({
  id,
  domain,
  email,
}: {
  id: string;
  domain: string;
  email: string;
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

      # Check the domain and return output
      result = check_domain_expiry("${domain}")
      Kestra.outputs({
        "result": result
      })

  - id: store_domain_status
    type: io.kestra.plugin.core.kv.Set
    key: "${id}-status"
    value: "{{ outputs.check_domain.vars.result }}"

  - id: alert_if_expiring
    type: io.kestra.plugin.core.flow.If
    condition: "{{ outputs.check_domain.vars.result.days_remaining < 30 }}"
    then:
      - id: send_mail_on_false
        type: io.kestra.plugin.notifications.mail.MailExecution
        to: ${email}
        from: noreply@jashandeep.me
        subject: "${domain} is expiring soon "
        host: mail.privateemail.com
        port: 465
        username: "noreply@jashandeep.me"
        password: "{{ secret('SECRET_EMAIL_PASSWORD')}}"

    else:
      - id: when_false
        type: io.kestra.plugin.core.log.Log
        message: "Condition was true"
     

triggers:
  - id: weekly_check
    type: io.kestra.plugin.core.trigger.Schedule
    cron: "0 0 * * *"  `;
};
