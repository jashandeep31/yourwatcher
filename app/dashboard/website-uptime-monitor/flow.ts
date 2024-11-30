export const websiteMonitoringTaskFlow = ({
  uniqueId,
  url,
}: {
  uniqueId: string;
  url: string;
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

  - id: set_status
    type: io.kestra.plugin.core.execution.Labels
    labels:
      status: "{{ outputs.request.code == 200 ? 'up' : 'down' }}"
      check_time: "{{ now() }}"


  - id: check_status
    type: io.kestra.plugin.core.flow.If
    condition: "{{ outputs.request.code == '200' }}"
    then:
      - id: when_true
        type: io.kestra.plugin.core.log.Log
        message: "Condition was true"
     
    else:
      - id: when_false
        type: io.kestra.plugin.core.log.Log
        message: "Condition was false"


errors:
  - id: test
    type: io.kestra.plugin.core.log.Log
    message: "Oh vwe failed"
  - id: set_status_after_failing
    type: io.kestra.plugin.core.execution.Labels
    labels:
      status: "down"
      check_time: "{{ now() }}"
`;
};
