export const websiteMonitoringTaskFlow = ({
  uniqueId,
  url,
  email,
}: {
  uniqueId: string;
  url: string;
  email: string;
}): string => {
  return `id: ${uniqueId}
namespace: monitoring.websites


triggers:
  - id: schedule
    type: io.kestra.plugin.core.trigger.Schedule
    cron: "*/5 * * * *" # This CRON expression schedules the task to run every 5 minutes

tasks:
  - id: request
    type: io.kestra.plugin.core.http.Request
    uri: "${url}"
    method: "GET"
    # failOnStatusCode: true

  - id: set_status
    type: io.kestra.plugin.core.execution.Labels
    labels:
      status: "{{ outputs.request.code == 200 ? 'up' : 'down' }}"
      check_time: "{{ now() }}"


  - id: check_status
    type: io.kestra.plugin.core.flow.If
    condition: "{{ outputs.request.code == 200 }}"
    then:
      - id: when_true
        type: io.kestra.plugin.core.log.Log
        message: "Condition was true"
     
    else:
      - id: send_mail_on_false
        type: io.kestra.plugin.notifications.mail.MailExecution
        to: ${email}
        from: noreply@jashandeep.me
        subject: "${url} is down please review it "
        host: mail.privateemail.com
        port: 465
        username: "noreply@jashandeep.me"
        password: "{{ secret('SECRET_EMAIL_PASSWORD')}}"


errors:
  - id: send_mail_on_fail
    type: io.kestra.plugin.notifications.mail.MailExecution
    to: ${email}
    from: noreply@jashandeep.me
    subject: "The workflow execution failed for the flow in the namespace of ${url}"
    host: mail.privateemail.com
    port: 465
    username: "noreply@jashandeep.me"
    password: "{{ secret('SECRET_EMAIL_PASSWORD')}}"
`;
};
