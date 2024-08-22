#include <stdio.h>
#include "18b20.h"
// my_component/src/my_component.c

#include "my_component.h"
#include "esp_log.h"

static const char *TAG = "my_component";

void my_component_init(void) {
    ESP_LOGI(TAG, "Initializing My Component...");
    // Initialization code here
}

void my_component_do_something(void) {
    ESP_LOGI(TAG, "My Component is doing something!");
    // Functionality code here
}
